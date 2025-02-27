import { component$ } from '@builder.io/qwik'
import { routeLoader$ } from '@builder.io/qwik-city'



export const useGitHubApi = routeLoader$(async() => {
  const response = await fetch('https://ungh.cc/users/kenta-afk/repos')

  try {

    if (!response.ok) {
      throw new Error('Failed to fetch')
    } 

    return await response.json()  
  }
  catch (error) {
    console.error(error)
  }
})

export const GitHubRepos = component$(() => {
  const repos = useGitHubApi()

  const works = ["discord-bot-with-hono", "phase4-Product", "baseball-app", "Umbrella"]
  
  return (
    <div class="whole">
      <div class="repos-container">
        {repos.value.repos.filter((repo: any )=> works.includes(repo.name)).map((repo: any) => (
          <div key={repo.name} class="repo">
            <a href={`https://github.com/${repo.repo}`} target="_blank">
              {repo.name}
            </a>
          </div>
        ))}
      </div>
    </div>
  )
})

export default component$(() => {
  return (
    
    <div>
      <h1>Works</h1>
      <GitHubRepos />
    </div>
  )

})