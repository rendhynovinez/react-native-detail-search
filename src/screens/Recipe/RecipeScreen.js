import React from 'react';
import {
  FlatList,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  TouchableHighlight
} from 'react-native';
import styles from './styles';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import BackButton from '../../components/BackButton/BackButton';
import { Rating, ListItem } from 'react-native-elements';
import axios from 'axios';

const { width: viewportWidth } = Dimensions.get('window');

export default class RecipeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTransparent: 'true',
      headerLeft: (
        <BackButton
          onPress={() => {
            navigation.goBack();
          }}
        />
      )
    };
  };
  

  constructor(props) {
    super(props);
    this.state = {
      activeSlide: 0,
      categories: []
    };
  }

  renderImage = ({ item }) => (
    <TouchableHighlight>
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={{ uri: item }} />
      </View>
    </TouchableHighlight>
  );

  renderItem = ({ item }) => (
    <ListItem
      title='Detail Categories :'
      subtitle={item.title}
      leftAvatar={{ source: { uri: item.avatar_url } }}
      bottomDivider
      chevron
    />
  )


  renderItem2 = ({ item }) => (
    <ListItem
      title='Detail Transaksi :'
      subtitle={item}
      leftAvatar={{ source: { uri: item.avatar_url } }}
      bottomDivider
      chevron
    />
  )


  async componentDidMount() {
    const { navigation } = this.props;
    const item = navigation.getParam('item');
    var URL = 'https://api.yelp.com/v3/businesses/'+item.id
    const AuthStr = 'Bearer '.concat('j9x4TFim9t0rIKm9Yzh7QkQuY3f0SB39x5cip1yI1xRJ8dO1qwblZSsPFHiT7bQs4O6BYODSHGUJEZHzedYNXJoSKh7KMV4ely8vzBsnU6sR6_dUporjxMgthoC4XXYx');
     axios.get(URL, { headers: { Authorization: AuthStr } }).then(response => {
                 const categories = response.data;
                 this.setState({ categories });
          })
          .catch((error) => {
            console.log('error 3 ' + error);
       
    });
  }
  keyExtractor = (item, index) => index.toString()
  render() {
    const { activeSlide } = this.state;
    const { navigation } = this.props;
    const item = this.state.categories;
    return (
      <ScrollView style={styles.container}>
        <View style={styles.carouselContainer}>
          <View style={styles.carousel}>
            <Carousel
              ref={c => {
                this.slider1Ref = c;
              }}
              data={item.photos}
              renderItem={this.renderImage}
              sliderWidth={viewportWidth}
              itemWidth={viewportWidth}
              inactiveSlideScale={1}
              inactiveSlideOpacity={1}
              firstItem={0}
              loop={false}
              autoplay={false}
              autoplayDelay={500}
              autoplayInterval={3000}
              onSnapToItem={index => this.setState({ activeSlide: index })}
            />
            <Pagination
              dotsLength={3}
              activeDotIndex={activeSlide}
              containerStyle={styles.paginationContainer}
              dotColor="rgba(255, 255, 255, 0.92)"
              dotStyle={styles.paginationDot}
              inactiveDotColor="white"
              inactiveDotOpacity={0.4}
              inactiveDotScale={0.6}
              carouselRef={this.slider1Ref}
              tappableDots={!!this.slider1Ref}
            />
          </View>
        </View>
        <View style={styles.infoRecipeContainer}>
          <Text style={styles.infoRecipeName}>{item.name}</Text>
          <View style={styles.infoContainser}>
             <Rating showRating fractions="{1}" imageSize={18} startingValue={item.rating} />
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoRecipe}>Reviews : {item.review_count}</Text>
            <Image style={styles.infoPhoto} source={require('../../../assets/icons/reviews.png')} />
            
          </View>
  
        </View>
        <View elevation={5} style={styles.stylesbottom}>
            <Text style={styles.infodetail}>Phone : {item.display_phone} |  Price  :  {item.price} </Text>
          </View>
          <Text style={styles.infoHead}>Categories : </Text>
          <FlatList
                keyExtractor={this.keyExtractor}
                data={item.categories}
                renderItem={this.renderItem}
          />

        <Text style={styles.infoHead}>Transaksi : </Text>
          <FlatList
                keyExtractor={this.keyExtractor}
                data={item.transactions}
                renderItem={this.renderItem2}
          />
      </ScrollView>
    );
  }
}
