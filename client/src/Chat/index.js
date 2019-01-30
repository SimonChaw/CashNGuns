import React, { Component } from 'react';
import Button from '../Button'
import './index.css';

class Chat extends Component {

  constructor(props){
    super(props);
    let name = this.getRandomName()
    this.state = {
      'name' : name,
    }

    this.sendMessage = this.sendMessage.bind(this)
    this.newMessage = this.newMessage.bind(this)
  }

  componentDidMount(){
    this.props.socket.on('messages', (data) => {
      this.setState({
        'messages' : data
      })
    })
    this.props.socket.on('new message', this.newMessage)
  }

  newMessage(pkg){
    console.log(pkg);
    let messages = this.props.messages
    messages.push(pkg)
    this.setState({
      'messages' : messages
    })
  }

  getRandomName(){
    var data = [
    	{"name": "Duncan"},
    	{"name": "Brian"},
    	{"name": "Ross"},
    	{"name": "Malachi"},
    	{"name": "Tyler"},
    	{"name": "Eagan"},
    	{"name": "Kaseem"},
    	{"name": "Quinn"},
    	{"name": "Alfonso"},
    	{"name": "Edward"},
    	{"name": "Demetrius"},
    	{"name": "Brian"},
    	{"name": "Stuart"},
    	{"name": "Dexter"},
    	{"name": "Brian"},
    	{"name": "Ferris"},
    	{"name": "Dane"},
    	{"name": "Sebastian"},
    	{"name": "Clinton"},
    	{"name": "Addison"},
    	{"name": "Keith"},
    	{"name": "Armand"},
    	{"name": "Caleb"},
    	{"name": "Hiram"},
    	{"name": "Lionel"},
    	{"name": "Conan"},
    	{"name": "Guy"},
    	{"name": "Xanthus"},
    	{"name": "Lucius"},
    	{"name": "Noah"},
    	{"name": "Armand"},
    	{"name": "David"},
    	{"name": "Jonah"},
    	{"name": "Dominic"},
    	{"name": "Sawyer"},
    	{"name": "Steven"},
    	{"name": "Carson"},
    	{"name": "Geoffrey"},
    	{"name": "Lev"},
    	{"name": "Moses"},
    	{"name": "Justin"},
    	{"name": "Magee"},
    	{"name": "Conan"},
    	{"name": "Jacob"},
    	{"name": "Sebastian"},
    	{"name": "Jamal"},
    	{"name": "Kenyon"},
    	{"name": "Ivor"},
    	{"name": "Samson"},
    	{"name": "Omar"},
    	{"name": "Gray"},
    	{"name": "Silas"},
    	{"name": "Abdul"},
    	{"name": "Erich"},
    	{"name": "Oren"},
    	{"name": "Lev"},
    	{"name": "Alvin"},
    	{"name": "Hayden"},
    	{"name": "Tad"},
    	{"name": "Stuart"},
    	{"name": "Wesley"},
    	{"name": "Abel"},
    	{"name": "Jermaine"},
    	{"name": "Wyatt"},
    	{"name": "Leonard"},
    	{"name": "Peter"},
    	{"name": "Andrew"},
    	{"name": "Kane"},
    	{"name": "Bevis"},
    	{"name": "Louis"},
    	{"name": "Upton"},
    	{"name": "Bruce"},
    	{"name": "Hammett"},
    	{"name": "Zeph"},
    	{"name": "Keane"},
    	{"name": "Ignatius"},
    	{"name": "Griffin"},
    	{"name": "Emmanuel"},
    	{"name": "Baxter"},
    	{"name": "Kasper"},
    	{"name": "Kareem"},
    	{"name": "Chaim"},
    	{"name": "Macon"},
    	{"name": "Kibo"},
    	{"name": "Emerson"},
    	{"name": "Todd"},
    	{"name": "Hector"},
    	{"name": "Kuame"},
    	{"name": "Stephen"},
    	{"name": "Vincent"},
    	{"name": "Lester"},
    	{"name": "Price"},
    	{"name": "Kirk"},
    	{"name": "Chaim"},
    	{"name": "Tyler"},
    	{"name": "Patrick"},
    	{"name": "Keith"},
    	{"name": "Nigel"},
    	{"name": "Travis"},
    	{"name": "Barrett"}
    ];
    let rand = Math.round(Math.random() * data.length)
    return data[rand].name
  }

  sendMessage(){
    let message = document.getElementById('txtMsg').value;
    let pkg = {
      'name' : this.state.name,
      'message' : message
    }
    this.props.socket.send(pkg, 'message')
    document.getElementById('txtMsg').value = "";
  }

  render(){
    return(
      <div style={{display:'flex', flexDirection:'column',height:'95vh'}}>
        <div className="chatLog">
          <div className="message">
            <div className="title">Sender:</div>
            <div className="content">This here is your chat. Use it to communicate with other players</div>
          </div>
          {[...this.props.messages].map(pkg => (
            <div className="message">
              <div className="title">{pkg.name}:</div>
              <div className="content">{pkg.message}</div>
            </div>
          ))}
        </div>
        <div style={{display:'flex', flexDirection:'row', backgroundColor:'black'}}>
          <textarea id="txtMsg" className="msgBox" style={{width:'75%', zIndex:1}}></textarea>
          <div style={{width:'25%'}}>
            <Button onClick={this.sendMessage} title={'SEND'} style={{width:'80%', height:'10vh'}}/>
          </div>
        </div>
      </div>
    )
  }

}

export default Chat;
