/**
 * Encapsulation d'un CanvasRenderingContext2D, se chargeant de calculer
 * les proportions en fonction des dimensions de la page.
 * Permet de spécifier un dessin où (0,0) est au centre de la page,
 * où (-50,-50) / (50,50) est forcément visible et où le ratio est 
 * préservé.
 * La classe se charge des opérations pour rendre visible le dessin quelles
 * que soient les dimensions de la page.
 */

export class Renderer {
  /**
   * Constructeur : initalise le canvas et le context 2d, puis calcule
   * les proportions.
   * 
   * @param {string} [canvasId='canvas'] Id du tag <canvas> à utiliser
   */
  constructor(canvasId = 'canvas') {
    this.canvas  = document.getElementById(canvasId)
    this.ctx = canvas.getContext('2d')

		this.resizeCanvas()
  }

  /**
   * Calcul des proportions en fonction de la taille physique du canvas
   */
  resizeCanvas = () => {
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight
    
		this.width = canvas.width
    this.height = canvas.height
    this.minLength = Math.min(this.width, this.height)

    this.origin = {
      x: this.width / 2,
      y: this.height / 2,
    }
    this.coef = {
      x: this.minLength / 100,
      y: this.minLength / 100,
    }
  }

  /**
   * Convertit une coordonnée horizontale du dessin en
   * coordonnée horizontale du canvas
   *
   * @param {number} x Coordonnée à convertir
   * @returns {number} Coordonnée convertie
   */
  getX = (x) => {
    return this.origin.x + x * this.coef.x
  }

  /**
   * Convertit une coordonnée verticale du dessin en
   * coordonnée verticale du canvas
   *
   * @param {number} x Coordonnée à convertir
   * @returns {number} Coordonnée convertie
   */
	getY = (y) => {
		return this.origin.y + y * this.coef.y
	}

  /**
   * Ensemble de fonctions reprenant les fonctions de dessin sur un canvas,
   * mais avec une opération de conversion des coordonnées.
   */

  moveTo = (x, y) => {
		this.ctx.moveTo(
      this.getX(x),
      this.getY(y)
    )
  }
  
	lineTo = (x, y) => {
		this.ctx.lineTo(
      this.getX(x),
      this.getY(y)
    )
  }
  
  line = (x1, y1, x2, y2, color = null) => {
    this.ctx.beginPath()
    this.moveTo(x1, y1)
    this.lineTo(x2, y2)
    if (color) {
      this.ctx.strokeStyle = color
    }
    this.ctx.stroke()
  }

  polygon = (points, color) => {
		this.ctx.fillStyle = color
		this.ctx.beginPath()
    this.moveTo(points[0][0], points[0][1])
    for (let i = 1; i < points.length; i++) {
      this.lineTo(points[i][0], points[i][1])
    }
    this.ctx.closePath()
		this.ctx.fill()
  }

  circle = (x, y, radius, color = null) => {
    this.ctx.beginPath()
    this.ctx.arc(
      this.getX(x),
      this.getY(y),
      radius * this.coef.x,
      0,
      2 * Math.PI,
    )
    if (color) {
      this.ctx.strokeStyle = color
    }
    this.ctx.stroke()
  }

  createRadialGradient = (x1, y1, r1, x2, y2, r2) => {
    return this.ctx.createRadialGradient(
      this.getX(x1),
      this.getY(y1),
      r1 * this.coef.x,
      this.getX(x2),
      this.getY(y2),
      r2 * this.coef.x,
    )
  }

  saveContext = () => {
    this.ctx.save()
  }

  restoreContext = () => {
    this.saveContext.restore()
  }
}

export default { Renderer }
