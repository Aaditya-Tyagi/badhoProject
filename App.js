import { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import ApolloClient from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import gql from 'graphql-tag'

export default function App () {
  const cache = new InMemoryCache()
  const link = new HttpLink({
    uri: 'https://spacex-production.up.railway.app/'
  })
  const client = new ApolloClient({
    cache,
    link
  })
  const GET_LATEST_LAUNCH = gql`
    query GetLatestLaunch {
      launchLatest {
        mission_name
        launch_date_utc
        rocket {
          rocket_name
        }
        links {
          article_link
          video_link
        }
      }
    }
  `
  const [latestLaunch, setLatestLaunch] = useState(null)
  useEffect(() => {
    client
      .query({
        query: GET_LATEST_LAUNCH
      })
      .then(result => {
        setLatestLaunch(result.data.launchLatest)
      })
      .catch(error=>console.error(error))
  }, [])
  if (!latestLaunch) {
    return <Text>Loading...</Text>
  }
  return (
    <View>
      <Text>{latestLaunch.mission_name}</Text>
      <Text>{latestLaunch.launch_date_utc}</Text>
      <Text>{latestLaunch.rocket.rocket_name}</Text>
      <Text>{latestLaunch.links.video_link}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
