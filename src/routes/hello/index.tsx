import { component$, useSignal, useStylesScoped$, useTask$ } from '@builder.io/qwik';
import { routeLoader$, Form, routeAction$, server$ } from '@builder.io/qwik-city';
import styles from "./index.css?inline";

export const useDadJoke = routeLoader$(async () => {
    const response = await fetch('https://icanhazdadjoke.com/', {
        headers: { Accept: 'application/json' },
    });
    return (await response.json()) as {
        id: string;
        status: number;
        joke: string;
    };
});

export const useJokeVoteAction = routeAction$((props) => {
    console.log('VOTE', props);
});

export default component$(() => {
    useStylesScoped$(styles);  
    const dadJokeSignal = useDadJoke();
    const favoriteJokeAction = useJokeVoteAction();
    const isFavoriteSignal = useSignal(false);

    useTask$(({ track }) => {
        track(() => isFavoriteSignal.value);
        console.log('FAVORITE (isomorphic)', isFavoriteSignal.value);
        server$(() => {
            console.log('FAVORITE (server)', isFavoriteSignal.value);
        })();
    });
  
    return (
        <>
            <div>
                <p>{dadJokeSignal.value.joke}</p>
            </div>
            <div>
                <Form action={favoriteJokeAction}>
                    <input type="hidden" name="jokeID" value={dadJokeSignal.value.id} />
                    <button name="vote" value="up">
                        👍
                    </button>
                    <button name="vote" value="down">
                        👎
                    </button>
                </Form>
            </div>
            <div>
                <button
                    onClick$={() => {
                        isFavoriteSignal.value = !isFavoriteSignal.value;
                    }}
                >
                    {isFavoriteSignal.value ? '❤️' : '🤍'}
                </button>
            </div>
        </>
    );
});