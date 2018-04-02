import React, { Component } from 'react';
import FotoItem from './Foto';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import TimelineApi from '../logicas/TimelineApi';
import {connect} from 'react-redux';

class Timeline extends Component {

  carregarFotos(props) {
    let urlPerfil;

    if (props.login === undefined) {
      urlPerfil = `https://instalura-api.herokuapp.com/api/fotos?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`
    } else {
      urlPerfil = `https://instalura-api.herokuapp.com/api/public/fotos/${props.login}`
    }

    this.props.lista(urlPerfil);
  }

  componentDidMount() {
    this.carregarFotos(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.login !== this.login) {
      this.carregarFotos(nextProps);
    }
  }

  render() {
    return (
      <div className="fotos container">
        <ReactCSSTransitionGroup
          transitionName="timeline"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}>
          {
            this.props.fotos.map(foto => <FotoItem key={foto.id} foto={foto} like={this.props.like} comenta={this.props.comenta} />)
          }
        </ReactCSSTransitionGroup>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {fotos : state.timeline}
};

const mapDispatchToProps = dispatch => {
  return {
    like: (fotoId) => {
      dispatch(TimelineApi.like(fotoId));
    },
    comenta: (fotoId, comentario) => {
      dispatch(TimelineApi.comenta(fotoId, comentario));
    },
    lista: (urlPerfil) => {
      dispatch(TimelineApi.lista(urlPerfil));
    }
  }
}

const TimelineContainer = connect(mapStateToProps, mapDispatchToProps)(Timeline);

export default TimelineContainer