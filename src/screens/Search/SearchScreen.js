import React from 'react';
import {
  FlatList,
  Text,
  View,
  Image,
  TouchableHighlight
} from 'react-native';
import styles from './styles';
import { SearchBar } from 'react-native-elements';
import MenuImage from '../../components/MenuImage/MenuImage';
import axios from 'axios';

export default class SearchScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerRight: (
        <MenuImage
          onPress={() => {
            navigation.openDrawer();
          }}
        />
      ),
      headerTitle: (
        <SearchBar
          containerStyle={{
            backgroundColor: 'transparent',
            borderBottomColor: 'transparent',
            borderTopColor: 'transparent',
            flex: 1
          }}
         
          inputContainerStyle={{
            backgroundColor: '#EDEDED'
          }}
          inputStyle={{
            backgroundColor: '#EDEDED',
            borderRadius: 10,
            color: 'black'
          }}
          onChangeText={text => params.handleSearch(text)}
          placeholder="Search"
          value={params.data}
        />
      )
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      value: '',
      data: []
    };
  }

  componentDidMount() {

    const { navigation } = this.props;
    navigation.setParams({
      handleSearch: this.handleSearch,
      data: this.getValue
    });
    var URL = 'https://api.yelp.com/v3/businesses/search?location=new%20york&limit=50'
    const AuthStr = 'Bearer '.concat('j9x4TFim9t0rIKm9Yzh7QkQuY3f0SB39x5cip1yI1xRJ8dO1qwblZSsPFHiT7bQs4O6BYODSHGUJEZHzedYNXJoSKh7KMV4ely8vzBsnU6sR6_dUporjxMgthoC4XXYx');
    axios.get(URL, { headers: { Authorization: AuthStr } }).then(response => {
                  this.setState({
                    value: '',
                    data: response.data.businesses,
                  });
          })
          .catch((error) => {
            alert('Internal Server Error');
        });
  
  }


  handleSearch = text => {
      var URL = 'https://api.yelp.com/v3/businesses/search?location=new%20york&term='
      if (text != '') {
          var URL = 'https://api.yelp.com/v3/businesses/search?location=new%20york&term='+text
      } 

    const AuthStr = 'Bearer '.concat('j9x4TFim9t0rIKm9Yzh7QkQuY3f0SB39x5cip1yI1xRJ8dO1qwblZSsPFHiT7bQs4O6BYODSHGUJEZHzedYNXJoSKh7KMV4ely8vzBsnU6sR6_dUporjxMgthoC4XXYx');
    axios.get(URL, { headers: { Authorization: AuthStr } }).then(response => {
                  this.setState({
                    value: text,
                    data: response.data.businesses,
                  });
                
          })
          .catch((error) => {
            console.log('error 3 ' + error);
        });
  };

  getValue = () => {
    return this.state.value;
  };

  onPressRecipe = item => {
    this.props.navigation.navigate('Recipe', { item });
  };

  renderRecipes = ({ item }) => (
    <TouchableHighlight underlayColor='rgba(73,182,77,1,0.9)' onPress={() => this.onPressRecipe(item)}>
      <View style={styles.container}>
        <Image style={styles.photo} source={{ uri: item.image_url }} />
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.category}>Reviews : {item.review_count}</Text>
        <Text style={styles.category}>Stars : {item.rating}</Text>
      </View>
    </TouchableHighlight>
  );

  render() {
    return (
      <View>
        <FlatList
          vertical
          showsVerticalScrollIndicator={false}
          numColumns={2}
          data={this.state.data}
          renderItem={this.renderRecipes}
          keyExtractor={item => `${item.id}`}
        />
      </View>
    );
  }
}
