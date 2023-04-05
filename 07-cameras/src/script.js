import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'

// Sizes
const sizes = {
    width: 800,
    height: 600
}

const cursor = {
    x: 0,
    y: 0
}

window.addEventListener('mousemove', (event) => {
    
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = -(event.clientY / sizes.height - 0.5)
})

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')



// Scene
const scene = new THREE.Scene()

// Object
const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
scene.add(mesh)
const aspectRatio = sizes.width / sizes.height
// Camera
const camera = new THREE.PerspectiveCamera(75, 
    aspectRatio,
    0.1, 
    100)

// const camera = new THREE.OrthographicCamera(-1 * aspectRatio, 
//     1 * aspectRatio,
//     1, 
//     -1,
//     0.1,
//     100)



camera.position.z = 3
console.log(camera.position.length())

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true;

scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// Animate
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    //mesh.rotation.y = elapsedTime;

    // camera.position.x = Math.sin(cursor.x * 2 * Math.PI) * 2
    // camera.position.z = Math.cos(cursor.x * 2 * Math.PI) * 2
    // camera.position.y = cursor.y * 3
    //camera.lookAt(mesh.position)
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()