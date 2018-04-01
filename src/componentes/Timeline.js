import React, { Component } from 'react';
import FotoItem from './Foto';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import TimelineApi from '../logicas/TimelineApi';

export default class Timeline extends Component {

  constructor() {
    super();
    this.state = { fotos: [] };
    //this.login = this.props.login;
  }

  componentWillMount() {
    this.props.store.subscribe(() => {
      this.setState({ fotos: this.props.store.getState() });
    })
  }

  carregarFotos(props) {
    let urlPerfil;

    if (props.login === undefined) {
      urlPerfil = `https://instalura-api.herokuapp.com/api/fotos?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`
    } else {
      urlPerfil = `https://instalura-api.herokuapp.com/api/public/fotos/${props.login}`
    }

    this.props.store.dispatch(TimelineApi.lista(urlPerfil));
  }

  componentDidMount() {
    this.carregarFotos(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.login !== undefined) {
      this.carregarFotos(nextProps);
    }
  }

  like(fotoId) {
    this.props.store.dispatch(TimelineApi.like(fotoId));
  }

  comenta(fotoId, comentario) {
    this.props.store.dispatch(TimelineApi.comenta(fotoId, comentario));
  }

  render() {
    return (
      <div className="fotos container">
        <ReactCSSTransitionGroup
          transitionName="timeline"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}>
          {
            this.state.fotos.map(foto => <FotoItem key={foto.id} foto={foto} like={this.like.bind(this)} comenta={this.comenta.bind(this)} />)
          }
        </ReactCSSTransitionGroup>
      </div>
    )
  }
}