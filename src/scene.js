/**
 * Création du dessin
 */

import { Renderer } from './renderer'

export class Scene {
  /**
   * Constructeur : initalise la scène et la dessine une première fois dans un
   * élément <canvas> prédéfini.
   * Si les dimensions de la page sont modifiées, recalcule les dimensions
   * du dessin et le redessine.
   * 
   * @param {string} [canvasId='canvas'] Id du tag <canvas> à utiliser
   */
  constructor(canvasId = 'canvas') {
    // Encapsulation du CanvasRenderingContext2D, gestion des proportions, etc.
    this.renderer = new Renderer(canvasId)

    // Initialisation et dessin
    this.initScene()
    this.drawScene()

    // Lecture d'un éventuel événement en cas de redimension de la page
    window.onresize = (event) => {
      this.renderer.resizeCanvas()
      this.drawScene()
    }
  }

  /**
   * Initialisation des paramètres de la scène.
   * Essentiellement, on dessine 18 tores légèrement décentrés, de rayons
   * légèrement différents, les couleurs alternant entre rouge, vert et bleu.
   */
  initScene = () => {
    // Nombre d'objets à dessiner
    this.length = 2 * 9
    // Centres des objets
    this.x = []
    this.y = []
    // Rayon de base
    this.radius = []
    // Largeur de base du tore
    this.lineWidth = []
    // Rayons extérieurs (8 points par objet)
    this.radiusOuter = []
    // Rayons intérieurs (8 points par objet)
    this.radiusInner = []
    // Couleurs
    this.r = []
    this.g = []
    this.b = []

    for (let i = 0; i < this.length; i++) {
      // Centre légèrement décentré pour chaque objet
      this.x[i] = 5 * (Math.random() - 0.5)
      this.y[i] = 5 * (Math.random() - 0.5)
      // Rayon et largeur de base
      this.radius[i] = 20 + 5 * Math.random()
      this.lineWidth[i] = 5 + 2 * Math.random()

      // Extérieur et intérieur de chaque objet
      this.radiusInner[i] = []
      this.radiusOuter[i] = []
      for (let j = 0; j < 8; j++) {
        this.radiusOuter[i].push(this.radius[i] + this.lineWidth[i] + 5 * (Math.random() - 0.5))
        this.radiusInner[i].push(this.radius[i] - this.lineWidth[i] + 5 * (Math.random() - 0.5))
      }

      // Couleur : alternance entre rouge, vert et bleu
      this.r[i] = i % 3 === 0 ? 255 : 0
      this.g[i] = i % 3 === 1 ? 255 : 0
      this.b[i] = i % 3 === 2 ? 255 : 0
    }
  }  

  /**
   * Dessin de la scène
   */
  drawScene = () => {
    // Opération de composition, afin d'obtenir du blanc aux endroits où plusieurs
    // objets se superposent
    this.renderer.ctx.globalCompositeOperation = 'lighten'

    // Itération sur l'ensemble des objets
    for (let i = 0; i < this.length; i ++) {
      // Création d'un gradient partant de radius-lineWidth et se terminant
      // à radius+lineWidth, noir aux extrémités et rouge/vert/bleu au centre
      const gradient = this.renderer.createRadialGradient(
        this.x[i], 
        this.y[i],
        this.radius[i] - this.lineWidth[i] + 2,
        this.x[i],
        this.y[i],
        this.radius[i] + this.lineWidth[i] - 2
      )
      gradient.addColorStop(0, 'rgba(0, 0, 0, 1)')
      gradient.addColorStop(0.5, 'rgba(' + this.r[i] + ', ' + this.g[i] + ', ' + this.b[i] + ', 1)')
      gradient.addColorStop(1, 'rgba(0, 0, 0, 1)')
      this.renderer.ctx.fillStyle = gradient
      
      this.renderer.ctx.beginPath()
      // Trait extérieur (8 points dessinés dans le sens des aiguilles d'une montre)
      this.drawPolygon(this.x[i], this.y[i], this.radiusOuter[i], 8, -2 * Math.PI / 8)
      // Trait intérieur (8 points dessinés dans le sens inverse des aiguilles d'une montre)
      this.drawPolygon(this.x[i], this.y[i], this.radiusInner[i], -5, 2 * Math.PI / 8)

      this.renderer.ctx.fill()
    }
  }

  /**
   * Rotation d'un point autour de l'origine
   *
   * @param {number} x Coordonnée horizontale du point
   * @param {number} y Coordonnée vertical du point
   * @param {number} angle Angle en radians
   * @returns {Array} Tableau [x, y] contenant les
   *   coordonnées du point après la rotation
   */
  rotate = (x, y, angle) => {
    return [
      x * Math.cos(angle) - y * Math.sin(angle),
      y * Math.cos(angle) + x * Math.sin(angle)
    ]
  }

  /**
   * Dessin d'une sorte de polygone autour d'un centre
   *
   * @param {number} xc Centre du polygone (coordonnée horizontale)
   * @param {number} yc Centre du polygone (coordonnée vertical)
   * @param {Array} polygon Tableau des rayons pour chaque point du polygone
   * @param {number} controlLength longueur des points de contrôle pour la courbe de Bézier
   * @param {number} angleStep Pas d'angle séparant chaque point
   */
  drawPolygon = (xc, yc, polygon, controlLength, angleStep) => {
    let a1 = 0
    for (let j = 0; j < polygon.length; j++) {
      const a2 = a1 + angleStep
      const [x1, y1] = this.rotate(polygon[j], 0, a1)
      const [cx1, cy1] = this.rotate(0, -controlLength, a1)
      const [x2, y2] = this.rotate(polygon[(j + 1) % (polygon.length)], 0, a2)
      const [cx2, cy2] = this.rotate(0, controlLength, a2)

      if (j === 0) {
        this.renderer.ctx.moveTo(
          this.renderer.getX(xc + x1),
          this.renderer.getY(yc + y1)
        )
      }
      this.renderer.ctx.bezierCurveTo(
        this.renderer.getX(xc + x1 + cx1),
        this.renderer.getY(yc + y1 + cy1),
        this.renderer.getX(xc + x2 + cx2),
        this.renderer.getY(yc + y2 + cy2),
        this.renderer.getX(xc + x2),
        this.renderer.getY(yc + y2)
      )

      a1 += angleStep
    }
    this.renderer.ctx.closePath()
  }
}

export default { Scene }
