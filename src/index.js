/**
 * Point d'entrée du Javascript :
 * chargement des css et de l'objet Scene.
 */

import './css/reset.css'
import './css/index.css'

import { Scene } from './scene'

$(document).ready(() => {
  const scene = new Scene()
})
