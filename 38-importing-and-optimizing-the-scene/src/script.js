import * as dat from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import firefliesVertexShader from './shaders/fireflies/vertex.glsl'
import firefliesFragmentShader from './shaders/fireflies/fragment.glsl'
import portalVertexShader from './shaders/portal/vertex.glsl'
import portalFragmentShader from './shaders/portal/fragment.glsl'



/**
 * Base
 */
// Debug

const debugObject = {}
const gui = new dat.GUI({
    width: 400
})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader()

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

//textures

const bakedTexture = textureLoader.load('baked_new.jpg');
bakedTexture.flipY = false;
bakedTexture.encoding = THREE.sRGBEncoding;

const bakedMaterial = new THREE.MeshBasicMaterial({map: bakedTexture});


// pole light material

const poleLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffe5})

debugObject.portalColorStart = '#3e0f3e';
debugObject.portalColorEnd = '#1f321f';

gui.addColor(debugObject, 'portalColorStart')
.onChange(() => {
    portalMaterial.uniforms.uColorStart.value.set(debugObject.portalColorStart);
});

gui.addColor(debugObject, 'portalColorEnd')
.onChange(() => {
    portalMaterial.uniforms.uColorEnd.value.set(debugObject.portalColorEnd);
})

const portalMaterial = new THREE.ShaderMaterial(
    {
        uniforms: {
            uTime: {value: 0},
            uPixelRatio: {value: Math.min(window.devicePixelRatio, 2)},
            uSize: {value: 200},
            uColorStart: {value: new THREE.Color(debugObject.portalColorStart)},
            uColorEnd: {value: new THREE.Color(debugObject.portalColorEnd)},
        },
        vertexShader: portalVertexShader,
        fragmentShader: portalFragmentShader,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    }
)

gltfLoader.load(
    'portal_scene_names.glb',
    (gltf) => {

        gltf.scene.traverse((child) =>
        {
            child.material = bakedMaterial
        })

        const poleLight1Mesh = gltf.scene.children.find(child => child.name === 'poleLight1')
        const poleLight2Mesh = gltf.scene.children.find(child => child.name === 'poleLight2')
        const portalLightMesh = gltf.scene.children.find(child => child.name === 'portalLight')


        poleLight1Mesh.material = poleLightMaterial;
        poleLight2Mesh.material = poleLightMaterial;

        portalLightMesh.material = portalMaterial;


        scene.add(gltf.scene)
    })

// fireflies

const firefliesGeometry = new THREE.BufferGeometry()
const firefliesCount = 30;
const positionArray = new Float32Array(firefliesCount * 3);
const scaleArray = new Float32Array(firefliesCount);

for(let i = 0; i < firefliesCount; i++){
    positionArray[i * 3 + 0] = (Math.random() - 0.5) * 4;
    positionArray[i * 3 + 1] = Math.random() * 1.5;
    positionArray[i * 3 + 2] = (Math.random() - 0.5) * 4;

    scaleArray[i] = Math.random()
}

firefliesGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
firefliesGeometry.setAttribute('aScale', new THREE.BufferAttribute(scaleArray, 1));



// Material
const firefliesMaterial = new THREE.ShaderMaterial(
    {
        uniforms: {
            uTime: {value: 0},
            uPixelRatio: {value: Math.min(window.devicePixelRatio, 2)},
            uSize: {value: 200}
        },
        vertexShader: firefliesVertexShader,
        fragmentShader: firefliesFragmentShader,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    }
)

const fireflies = new THREE.Points(firefliesGeometry, firefliesMaterial);
scene.add(fireflies);

gui.add(firefliesMaterial.uniforms.uSize, 'value').min(0).max(500).step(1).name('size')

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

    firefliesMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2)
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 4
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.sRGBEncoding;

debugObject.clearColor = '#342909'
renderer.setClearColor(debugObject.clearColor)
gui.addColor(debugObject, 'clearColor').onChange(() => {
    renderer.setClearColor(debugObject.clearColor)
})

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime() 

    firefliesMaterial.uniforms.uTime.value = elapsedTime;
    portalMaterial.uniforms.uTime.value = elapsedTime;

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()