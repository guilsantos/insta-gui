import Pubsub from 'pubsub-js';

export default class TimelineStore {

  constructor(fotos){
    this.fotos = fotos;
  }

  lista(urlPerfil){
    fetch(urlPerfil)
    .then(response => response.json())
    .then(fotos => {
      this.fotos = fotos;
      Pubsub.publish('timeline', this.fotos);
    });
  }

  like(fotoId){
    fetch(`https://instalura-api.herokuapp.com/api/fotos/${fotoId}/like?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`, { method: 'POST' })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Não foi possível realizar o like da foto');
        }
      })
      .then(liker => {
        const fotoEncontrada = this.fotos.find(foto => foto.id === fotoId);
        fotoEncontrada.likeada = !fotoEncontrada.likeada;

        const possivelLiker = fotoEncontrada.likers.find(likerAtual => likerAtual.login === liker.login);
        if(possivelLiker === undefined){
          fotoEncontrada.likers.push(liker);
        } else {
          const novoslikers = fotoEncontrada.likers.filter(likerAtual => likerAtual.login !== liker.login);
          fotoEncontrada.likers = novoslikers;
        }
        Pubsub.publish('timeline', this.fotos);
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
      const fotoEncontrada = this.fotos.find(foto => foto.id === fotoId);
      fotoEncontrada.comentarios.push(novoComentario);
      Pubsub.publish('timeline', this.fotos);
    })
  }

  subscribe(callback){
    Pubsub.subscribe('timeline', (topico, fotos) => {
      callback(fotos);
    })
  }
}
