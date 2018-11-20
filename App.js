import React, { 
  Component 
} from 'react';

import { 
  AppRegistry, 
  Text, 
  TextInput, 
  View, 
  AsyncStorage
} from 'react-native';

import { 
  Card, 
  ListItem,
  Header, 
  Icon,
  CheckBox, 
} from 'react-native-elements'

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      todo:[],
      todoName:"",
      isDone:false,
      tmpName:""
      };
      this.addCard = this.addCard.bind(this);
  }

  changeDone(item){
    let rev = !item.isDone
    item.isDone = rev

    AsyncStorage.setItem(item.todoName,JSON.stringify(item),(err) => {
      if (err) {
        alert(err)
        return false;
      } else {
        this.getData();
        return true;
      }
    })
  }
  componentWillReceiveProps(){
    this.getData();
  }

  getData(){ 
    AsyncStorage.getAllKeys((err, keys)=>{ 
    if (err) {
      console.error(err)
      return false
    } else { 
      AsyncStorage.multiGet( 
        keys, (err, data) => { 
          let next = data.map((i)=> { return JSON.parse(i[1]) })
          this.setState(previousState => ({todo:next}));
          return true;
        }
      ) 
    } 
  }) 
}

  deleteCard(item){
    AsyncStorage.removeItem(item.todoName, (err) => {
      if (err) {
        return false;
      } else {
        this.getData();
        return true;
      }
    })
  }

  addCard(){
    let tmp = {"todoName":this.state.tmpName,"isDone":false}
    AsyncStorage.setItem(this.state.tmpName, JSON.stringify(tmp), (err) => {
      if (err) {
        console.err(err);
        return false;
      } else {
        this._textInput.setNativeProps({text:''});
        this.getData();
        return true;
      }
    })
  }

  render() {
    const { todo, tmpName} = this.state
    return (
      < View>
        <Header
          backgroundColor='#000' 
          centerComponent={{ 
            text: 'ToDoLIST', 
            style: { 
              color: '#fff' 
            }
          }}
        />
        <View>
          <Card containerStyle={{padding: 0}}>
            {
              todo.map((u, i) => {
                return(
                  <ListItem  
                    rightIcon={
                      <Icon name='delete'  onPress={() => this.deleteCard(u)}/>
                    }
                    title={u.todoName}
                    //TODO:change prop
                    leftIcon={
                      <CheckBox 
                        checked={u.isDone}
                        containerStyle={{
                          backgroundColor:'#FFF',
                          borderColor:'#FFF'
                        }}
                        onPress={
                         () => {this.changeDone(u)}
                        }
                      />
                    }
                  />
                );
              })
            }
          </Card>
        </View>
        <View>
          <Card containerStyle={{padding: 0}}>
            <ListItem
              rightIcon={
                <Icon
                  name='add'
                  onPress={this.addCard}
                />
                }
                title={
                  <TextInput
                    onChangeText={(text) => this.setState(previousState => ({tmpName:text}))}
                    value={tmpName}
                    ref={component => this._textInput = component}
                  />
                }
              />
          </Card>
        </View>
      </View>
    );
  }
}