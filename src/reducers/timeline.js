export function timeline(state = [], action) {
  if (action.type === 'LISTAGEM') {
    return action.fotos;
  }

  if (action.type === 'COMENTARIO') {
    const fotoEncontrada = state.find(foto => foto.id === action.fotoId);
    fotoEncontrada.comentarios.push(action.novoComentario);

    return state;
  }

  if (action.type === 'LIKE') {
    const fotoEncontrada = state.find(foto => foto.id === action.fotoId);
    fotoEncontrada.likeada = !fotoEncontrada.likeada;

    const possivelLiker = fotoEncontrada.likers.find(likerAtual => likerAtual.login === action.liker.login);
    if (possivelLiker === undefined) {
      fotoEncontrada.likers.push(action.liker);
    } else {
      const novoslikers = fotoEncontrada.likers.filter(likerAtual => likerAtual.login !== action.liker.login);
      fotoEncontrada.likers = novoslikers;
    }

    return state;
  }

  return state;
}