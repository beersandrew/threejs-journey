import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

const parameters = {
    ambientLightColor: 0xffffff,
    directionalLightColor: 0x00fffc,
    hemisphereSkyColor: 0xff0000,
    hemisphereGroundColor: 0x0000ff,
    pointLightColor: 0xff9000,
    rectAreaLightColor: 0x4e00ff,
    spotLightColor: 0x78ff00
}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(parameters.ambientLightColor, 0.5)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(parameters.directionalLightColor, 0.3)
scene.add(directionalLight)

directionalLight.position.set(1, 0.25, 0)

const hemisphereLight = new THREE.HemisphereLight(parameters.hemisphereSkyColor, parameters.hemisphereGroundColor, 0.3)

scene.add(hemisphereLight)

const pointLight = new THREE.PointLight(parameters.pointLightColor, 0.5)
scene.add(pointLight)


const rectAreaLight = new THREE.RectAreaLight(parameters.rectAreaLightColor, 2, 1, 1)
scene.add(rectAreaLight)


const spotLight = new THREE.SpotLight(parameters.spotLightColor, 0.5, 10, Math.PI * 0.1, 0.25, 1)
spotLight.position.set(0,2,3)
scene.add(spotLight)

gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001).name('ambient intensity')
gui.add(directionalLight, 'intensity').min(0).max(1).step(0.001).name('directional intensity')
gui.add(hemisphereLight, 'intensity').min(0).max(1).step(0.001).name('hemisphere intensity')
gui.add(pointLight, 'intensity').min(0).max(1).step(0.001).name('point intensity')
gui.add(rectAreaLight, 'intensity').min(0).max(10).step(0.001).name('rect area intensity')
gui.add(spotLight, 'intensity').min(0).max(10).step(0.001).name('spot intensity')


gui.add(rectAreaLight, 'width').min(0).max(10).step(0.001).name('rect area width')
gui.add(rectAreaLight, 'height').min(0).max(10).step(0.001).name('rect area height')



gui.add(pointLight.position, 'x').min(-5).max(5).step(0.01).name('point x')
gui.add(pointLight.position, 'y').min(-5).max(5).step(0.01).name('point y')
gui.add(pointLight.position, 'z').min(-5).max(5).step(0.01).name('point z')


gui.add(rectAreaLight.position, 'x').min(-5).max(5).step(0.01).name('rect area x')
gui.add(rectAreaLight.position, 'y').min(-5).max(5).step(0.01).name('rect area  y')
gui.add(rectAreaLight.position, 'z').min(-5).max(5).step(0.01).name('rect area  z')

gui.add(spotLight.position, 'x').min(-5).max(5).step(0.01).name('spot x')
gui.add(spotLight.position, 'y').min(-5).max(5).step(0.01).name('spot  y')
gui.add(spotLight.position, 'z').min(-5).max(5).step(0.01).name('spot  z')


gui.addColor(parameters, 'ambientLightColor')
    .onChange(() => {
        ambientLight.color = new THREE.Color(parameters.ambientLightColor)
    })

gui.addColor(parameters, 'directionalLightColor')
    .onChange(() => {
        directionalLight.color = new THREE.Color(parameters.directionalLightColor)
    })

gui.addColor(parameters, 'hemisphereSkyColor')
    .onChange(() => {
        hemisphereLight.color = new THREE.Color(parameters.hemisphereSkyColor)
    })

gui.addColor(parameters, 'hemisphereGroundColor')
    .onChange(() => {
        hemisphereLight.groundColor = new THREE.Color(parameters.hemisphereGroundColor)
    })

gui.addColor(parameters, 'pointLightColor')
    .onChange(() => {
        pointLight.color = new THREE.Color(parameters.pointLightColor)
    })

gui.addColor(parameters, 'rectAreaLightColor')
    .onChange(() => {
        rectAreaLight.color = new THREE.Color(parameters.rectAreaLightColor)
    })

gui.addColor(parameters, 'spotLightColor')
    .onChange(() => {
        spotLight.color = new THREE.Color(parameters.spotLightColor)
    })


const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2)
scene.add(hemisphereLightHelper)

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
scene.add(directionalLightHelper)

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
scene.add(pointLightHelper)

const spotLightHelper = new THREE.SpotLightHelper(spotLight, 0.2)
scene.add(spotLightHelper)

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight, 0.2)
scene.add(rectAreaLightHelper)


/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.position.x = - 1.5

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65

scene.add(sphere, cube, torus, plane)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()