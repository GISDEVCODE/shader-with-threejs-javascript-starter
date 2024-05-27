import * as THREE from "three"
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import vsh from  "/basic-vs.glsl"
import fsh from  "/basic-fs.glsl"

export default class App {
  constructor() {
    this._setupThreeJs()
    this._setupCamera()
    this._setupControls()
    this._setupEvents()
    this._setupModel()
  }

  _setupThreeJs() {
    const divContainer = document.querySelector("#canvas-container")
    this._divContainer = divContainer

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)

    divContainer.appendChild(renderer.domElement)

    this._renderer = renderer
    const scene = new THREE.Scene()
    this._scene = scene
  }

  _setupCamera() {
    const camera = new THREE.OrthographicCamera(0, 1, 1, 0, 0.1, 1000)
    camera.position.set(0, 0, 1)
    this._camera = camera
  }

  _setupModel() {
    const geometry = new THREE.PlaneGeometry(1, 1)
    const material = new THREE.ShaderMaterial({
      uniforms: {},
      vertexShader: vsh,
      fragmentShader: fsh
    })
    const mesh = new THREE.Mesh(geometry, material)

    mesh.position.set(0.5, 0.5, 0)

    this._scene.add(mesh)
  }

  _setupControls() {
    this._orbitControls = new OrbitControls(this._camera, this._divContainer)
  }

  _setupEvents() {
    window.onresize = this.resize.bind(this)
    this.resize()
    this._clock = new THREE.Clock()
    requestAnimationFrame(this.render.bind(this))
  }

  update() {
    const delta = this._clock.getDelta()
    this._orbitControls.update()
  }

  render() {
    this._renderer.render(this._scene, this._camera)
    this.update()

    requestAnimationFrame(this.render.bind(this))
  }

  resize() {
    const width = this._divContainer.clientWidth
    const height = this._divContainer.clientHeight

    this._camera.aspect = width / height
    this._camera.updateProjectionMatrix()

    this._renderer.setSize(width, height)
  }
}