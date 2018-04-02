import {listagem, like, comentario, notifica} from '../actions/actionCreator'

export default class TimelineApi {

  static lista(urlPerfil) {
    return dispatch => {
      fetch(urlPerfil)
        .then(response => response.json())
        .then(fotos => {
          dispatch(listagem(fotos));
          return fotos;
        });
    }
  }

  static like(fotoId) {
    return dispatch => {
      fetch(`https://instalura-api.herokuapp.com/api/fotos/${fotoId}/like?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`, { method: 'POST' })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Não foi possível realizar o like da foto');
          }
        })
        .then(liker => {
          dispatch(like(fotoId, liker));
          return liker;
        });
    }
  }

  static comenta(fotoId, comentarioEntrada) {
    return dispatch => {
      const requestInfo = {
        method: 'POST',
        body: JSON.stringify({ texto: comentarioEntrada }),
        headers: new Headers({
          'Content-type': 'application/json'
        })
      };

      fetch(`https://instalura-api.herokuapp.com/api/fotos/${fotoId}/comment?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`, requestInfo)
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('não foi possivel comentar');
          }
        })
        .then(novoComentario => {
          dispatch(comentario(fotoId, novoComentario));
          return novoComentario;
        })
    }
  }

  static pesquisa(login) {
    return dispatch => {
      fetch(`https://instalura-api.herokuapp.com/api/public/fotos/${login}`)
        .then(response => {
          if(response.ok){
            return response.json();
          } else {
            throw new Error('não foi possivel pesquisar');
          }
        })
        .then(fotos => {
          if(fotos.length === 0){
            dispatch(notifica('Usuario não encontrado'));
          } else {
            dispatch(notifica('Usuario encontrado'));
          }
          dispatch(listagem(fotos));
          return fotos;
        })
    }
  }
}
