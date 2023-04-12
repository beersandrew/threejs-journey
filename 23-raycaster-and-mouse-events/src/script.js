import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const ambientLight = new THREE.AmbientLight('#ffffff', 0.4)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight('#ffffff', 1)
directionalLight.position.set(0,0,3)
scene.add(directionalLight)
let duck = null
let duckScale = null
// loader
const glTFLoader = new GLTFLoader()
glTFLoader.load('/models/Duck/glTF-Binary/Duck.glb',
(glTF) => {
    duck = glTF.scene
    duckScale = new THREE.Vector3(
        glTF.scene.scale.x,
        glTF.scene.scale.y,
        glTF.scene.scale.z)
    scene.add(glTF.scene)
})

/**
 * Objects
 */
const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object1.position.x = - 2

const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)

const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object3.position.x = 2

scene.add(object1, object2, object3)

// Raycaster

const raycaster = new THREE.Raycaster()
const rayOrigin = new THREE.Vector3(-3, 0, 0)
const rayDirection = new THREE.Vector3(10, 0, 0)
rayDirection.normalize()
raycaster.set(
    rayOrigin,
    rayDirection
)

const intersect = raycaster.intersectObject(object2)

console.log(intersect)

const intersects = raycaster.intersectObjects([object1, object2, object3])

console.log(intersects)


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

// Mouse
const mouse = new THREE.Vector2()

window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX / sizes.width * 2 - 1
    mouse.y = -(event.clientY / sizes.height) * 2 + 1
})

window.addEventListener('mousedown', () => {
    if (currentIntersect !== null){
        if(currentIntersect.object === object1){
            console.log('click on 1')
        }
        else if(currentIntersect.object === object2){
            console.log('click on 2')
        }
        else if(currentIntersect.object === object3){
            console.log('click on 3')
        }
    }
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
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
let currentIntersect = null

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // animate objects
    object1.position.y = Math.sin(elapsedTime) * 3
    object2.position.y = Math.cos(elapsedTime) * 3
    object3.position.y = Math.sin(elapsedTime) * 2

    raycaster.setFromCamera(mouse, camera)


    // const rayOrigin = new THREE.Vector3(-3, 0, 0)
    // const rayDirection = new THREE.Vector3(1, 0, 0)
    // raycaster.set(
    //     rayOrigin,
    //     rayDirection
    // )  
    const objectsToTest = [object1, object2, object3]
    const intersects = raycaster.intersectObjects(objectsToTest)
    for(const object of objectsToTest){
       object.material.color.set('#ff0000')
    }
    for(const intersect of intersects){
        intersect.object.material.color.set('#0000ff')
    }

    if (intersects.length){
        if (currentIntersect === null){
            console.log('mouse enter')
        }
        currentIntersect = intersects[0]
    }
    else {
        if (currentIntersect !== null){
            console.log('mouse leave')
        }
        currentIntersect = null
    }
    
    if (duck !== null){
        console.log('duck not null')
        const modelIntersects = raycaster.intersectObject(duck)

        if (modelIntersects.length){
            console.log('intersect')
            duck.scale.set(
                duckScale.x * 1.2, 
                duckScale.y * 1.2,
                duckScale.z * 1.2)
        }
        else{
            console.log('no intersect')
            duck.scale.set(
                duckScale.x, 
                duckScale.y,
                duckScale.z)
        }
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()