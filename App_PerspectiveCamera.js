import * as THREE from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import vertexShaderCode from  "/shaders/vertex.glsl"
import fragmentShaderCode from  "/shaders/fragment.glsl"

export default class App {
  constructor() {
    this._setupThreeJs()
    this._setupCamera()
    this._setupControls()
    this._setupModel()
    this._setupEvents()
  }

  _setupThreeJs() {
    const divContainer = document.querySelector("#canvas-container")
    this._divContainer = divContainer

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    divContainer.appendChild(renderer.domElement)

    this._renderer = renderer
    const scene = new THREE.Scene()
    this._scene = scene
  }

  _setupCamera() {
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 10);
    camera.position.set(0, 0, 2);
    this._camera = camera
  }

  _setupModel() {
    const geometry = new THREE.PlaneGeometry(1, 1)
    const material = new THREE.RawShaderMaterial({
      vertexShader: vertexShaderCode,
      fragmentShader: fragmentShaderCode
    })
    const mesh = new THREE.Mesh(geometry, material)

    this._scene.add(mesh)
    this._material = material;
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
    // this._orbitControls.update()
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
    const pr = this._renderer.getPixelRatio();
  }
}
