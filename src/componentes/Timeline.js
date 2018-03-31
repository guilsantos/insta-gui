import React, { Component } from 'react';
import FotoItem from './Foto';
import Pubsub from 'pubsub-js';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export default class Timeline extends Component {

  constructor(){
    super();
    this.state = {fotos: []};
  }

  componentWillMount(){
    Pubsub.subscribe('timeline', (topico, fotos) => {
      this.setState({fotos});
    })
  }

  carregarFotos(props){
    let urlPerfil;

    if(props.login === undefined){
      urlPerfil = `https://instalura-api.herokuapp.com/api/fotos?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`
    } else {
      urlPerfil = `https://instalura-api.herokuapp.com/api/public/fotos/${props.login}`
    }

    fetch(urlPerfil)
    .then(response => response.json())
    .then(fotos => this.setState({fotos:fotos}));
  }

  componentDidMount(){
    this.carregarFotos(this.props);
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.login !== undefined){
      this.carregarFotos(nextProps);
    }
  }

  like(fotoId){
    fetch(`https://instalura-api.herokuapp.com/api/fotos/${fotoId}/like?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`, {method:'POST'})
    .then(response => {
      if(response.ok){
        return response.json();
      } else {
        throw new Error('Não foi possível realizar o like da foto');
      }
    })
    .then(liker => {
      Pubsub.publish('atualiza-liker', { fotoId, liker });
    });
  }

  comenta(fotoId, comentario){
    const requestInfo = {
      method: 'POST',
      body: JSON.stringify({ texto: comentario }),
      headers: new Headers({
        'Content-type': 'application/json'
      })
    };

    fetch(`https://instalura-api.herokuapp.com/api/fotos/${fotoId}/comment?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`, requestInfo)
    .then(response => {
      if(response.ok){
        return response.json();
      } else {
        throw new Error('não foi possivel comentar');
      }
    })
    .then(novoComentario => {
      Pubsub.publish('novos-comentarios', {fotoId, novoComentario})
    })
  }

  render() {
    return (
      <div className="fotos container">
        <ReactCSSTransitionGroup
          transitionName="timeline"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}>
          {
            this.state.fotos.map(foto => <FotoItem key={foto.id} foto={foto} like={this.like} comenta={this.comenta}/>)
          }
        </ReactCSSTransitionGroup>
      </div>
    )
  }
}