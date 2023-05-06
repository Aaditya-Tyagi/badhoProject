import { useEffect, useState } from 'react'
import {
  Linking,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native'
import ApolloClient from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import gql from 'graphql-tag'
import { Card, Title, Paragraph, TextInput, Button } from 'react-native-paper'
import { Image } from 'react-native'

//defining graphQL query
const GET_LATEST_LAUNCH = gql`
  query {
    launchesPast(limit: 10) {
      mission_name
      launch_date_utc
      details
      launch_site {
        site_name_long
      }
      links {
        article_link
        video_link
      }
      rocket {
        rocket_name
      }
    }
  }
`
// const staticImage=require('./assets/Frame 1.jpg')
export default function App () {
  const [pastLaunches, setPastLaunches] = useState([])
  const [loading, setLoading] = useState(true)
  const [filteredLaunches, setFilteredLaunches] = useState([])
  const [searchValue, setSearchValue] = useState('')
  // tried using custom fonts but didnt work as intended
  // const [fontLoading] = useFonts({
  //   'Space-Mono': require('./assets/SpaceMono/SpaceMono-Italic.ttf')
  // }
  // async function loadFonts () {
  //   await Font.loadAsync({
  //     'SpaceMono': require('./assets/SpaceMono/SpaceMono-Italic.ttf')
  //   })
  //   setfontLoading[false]
  // }
  //defining important variables for apollo client
  const cache = new InMemoryCache()
  const link = new HttpLink({
    uri: 'https://spacex-production.up.railway.app/'
  })
  const client = new ApolloClient({
    cache,
    link
  })
  //getting data from the api using apollo client
  useEffect(() => {
    client
      .query({
        query: GET_LATEST_LAUNCH
      })
      .then(result => {
        setPastLaunches(result.data.launchesPast)
        setLoading(false)
      })
      .catch(error => console.error(error))
    // loadFonts()
  }, [])
  // filter the past launches based on searchValue
  useEffect(() => {
    if (searchValue === '') {
      setFilteredLaunches(pastLaunches)
    } else {
      const filtered = pastLaunches.filter(launch =>
        launch.mission_name.toLowerCase().includes(searchValue.toLowerCase())
      )
      setFilteredLaunches(filtered)
    }
  }, [searchValue, pastLaunches])

  //used a internet picked function to extract the video id of a video from youtube link.
  // function extractVideoId (url) {
  //   const regex =
  //     /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  //   const match = url.match(regex)
  //   return match ? match[1] : null
  // }
  //if data is not loaded
  if (loading) {
    return (
      <View style={styles.topmostContainer}>
        <StatusBar barStyle='dark-content'></StatusBar>

        <SafeAreaView style={styles.navbar}>
          <Text style={styles.navbarText}>SpaceX Flights</Text>
        </SafeAreaView>
        <ScrollView contentContainerStyle={styles.container}>
          <Paragraph
            style={{
              marginTop: 30,
              height: 100,
              width: 250,
              textAlign: 'center',
              color: 'white'
            }}
          >
            Loading...
          </Paragraph>
        </ScrollView>
      </View>
    )
  }
  //setting data into Material Design Cards and setting into reuseable variable
  const viewingLaunches = filteredLaunches.map((item, key) => {
    return (
      <Card key={key} style={styles.viewItem}>
        <Card.Content style={styles.card}>
          <Title style={styles.title}>{item.mission_name}</Title>
          <Card
            onPress={() => Linking.openURL(item.links.video_link)}
            style={{
              backgroundColor: 'black',
              height: 120,
              width: '80%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
            elevation={3}
          >
            <Text
              style={{ color: 'white', fontSize: 8 }}
            >
              Cant see the video? no problem click here
            </Text>
          </Card>
          {/* <Image style={{width:'80%',height:120}} source={staticImage}/> */}
          {/* tried to embed a video link at the top of the card but the native video libraries throw unknown errors  */}
          {/* {item.links.video_link && (
            <Video
              source={{uri:item.links.video_link}}
              style={styles.video}
            />
          )} */}
          {/* {item.links.video_link && (
            <YouTube
              videoId={youtubeID}
              apiKey='AIzaSyDOHHXUwLurlazPQkX1XwZt5VEdV925CoA'
            />
          )} */}
          <Paragraph style={styles.missionName}>
            Rocket: {item.rocket.rocket_name}
          </Paragraph>
          <Paragraph style={styles.paragraph}>
            Launch date: {item.launch_date_utc}
          </Paragraph>
          <Paragraph style={styles.paragraph}>
            Description: {item.details}
          </Paragraph>
          <Paragraph style={styles.link}>For more info...</Paragraph>
          <Button
            onPress={() => Linking.openURL(item.links.article_link)}
            buttonColor='#8E24AA'
            textColor='white'
            style={{width:'90%'}}
          >
            See More
          </Button>
        </Card.Content>
      </Card>
    )
  })
  //defining app structure
  return (
    <View style={styles.topmostContainer}>
      <StatusBar barStyle='dark-content'></StatusBar>

      <SafeAreaView style={styles.navbar}>
        <Text style={styles.navbarText}>SpaceX Flights</Text>
        <TextInput
          placeholder='Search'
          placeholderTextColor='#888'
          style={styles.searchInput}
          value={searchValue}
          onChangeText={text => setSearchValue(text)}
        />
      </SafeAreaView>
      <ScrollView contentContainerStyle={styles.container}>
        {viewingLaunches}
      </ScrollView>
    </View>
  )
}

//defining app styles
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    paddingBottom: 60,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#070707'
  },
  navbar: {
    height: 75,
    backgroundColor: '#000000',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#202225'
  },
  navbarText: {
    marginStart: 15,
    marginTop: 23,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#8E24AA',
    textAlign: 'center',
    textShadowRadius: 2,
    backgroundColor: 'transparent',
    fontStyle: 'italic'
  },
  viewItem: {
    marginVertical: 10,
    paddingHorizontal: 10,
    elevation: 8,
    backgroundColor: '#202020',
    width: '90%'
  },
  card: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  video: {
    width: '100%',
    height: 200,
    marginTop: 10,
    marginBottom: 20
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'flex-start',
    color: 'white'
  },
  missionName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    marginTop: 15
  },
  paragraph: {
    fontSize: 10,
    marginBottom: 10,
    color: 'white',
    alignSelf: 'flex-start'
  },
  link: {
    fontSize: 10,
    alignSelf: 'flex-start',
    color: 'white'
  },
  searchInput: {
    marginEnd: 15,
    marginTop: 15,
    backgroundColor: 'transparent',
    color: 'white',
    minWidth:10
  }
})
