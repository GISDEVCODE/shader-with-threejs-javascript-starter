import * as THREE from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import vertexShaderCode from  "/shaders/vertex.glsl"
import fragmentShaderCode from  "/shaders/fragment.glsl"

export default class App {
  constructor() {
    this._setupThreeJs()
    this._setupCamera()
    // this._setupControls()
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
    const camera = new THREE.OrthographicCamera(0, 1, 1, 0, 0.1, 1000)
    camera.position.set(0, 0, 1)
    this._camera = camera
  }

  _setupModel() {
    const geometry = new THREE.PlaneGeometry(1, 1)
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: new THREE.Uniform(0),
        uResolution: new THREE.Uniform(new THREE.Vector3()),
        uMouse: new THREE.Uniform(new THREE.Vector4())
      },
      vertexShader: vertexShaderCode,
      fragmentShader: fragmentShaderCode
    })
    const mesh = new THREE.Mesh(geometry, material)

    mesh.position.set(0.5, 0.5, 0)

    this._scene.add(mesh)
    this._material = material;
  }

  _setupControls() {
    this._orbitControls = new OrbitControls(this._camera, this._divContainer)
  }

  _setupEvents() {
    window.onresize = this.resize.bind(this)
    this.resize()

    document.onmousemove = (event) => {
      const pr = this._renderer.getPixelRatio();
      const size = this._material.uniforms.uResolution.value;
      const lB = (event.buttons & 1) >> 0;
      const rB = (event.buttons & 2) >> 1;
      // const mB = (event.buttons & 4) >> 2;
      this._material.uniforms.uMouse.value.set(event.pageX * pr, (size.y - event.pageY) * pr, lB, rB);
    }

    document.onmousedown = document.onmousemove;
    document.onmouseup = document.onmousemove;

    this._clock = new THREE.Clock()
    requestAnimationFrame(this.render.bind(this))
  }

  update() {
    const delta = this._clock.getDelta()

    this._material.uniforms.uTime.value += delta;

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
    this._material.uniforms.uResolution.value.set(width*pr, height*pr, pr);
  }
}
