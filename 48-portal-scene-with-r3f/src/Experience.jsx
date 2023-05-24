import { shaderMaterial, Sparkles, Center, useTexture, useGLTF, OrbitControls } from '@react-three/drei'
import portalVertexShader from './shaders/portal/vertex.glsl'
import portalFragmentShader from './shaders/portal/fragment.glsl'
import * as THREE from 'three'
import { useFrame, extend } from '@react-three/fiber'
import { useRef } from 'react'


export default function Experience()
{

    const {nodes} = useGLTF('./model/portal.glb');
    console.log(nodes)

    const portalMaterial = useRef()

    const bakedTexture = useTexture('./model/baked.jpg')
    bakedTexture.flipY = false;

    const PortalMaterial = shaderMaterial(
        { 
            uTime: 0,
            uColorStart: new THREE.Color('#ff0000'),
            uColorEnd: new THREE.Color('#0000ff')
        },
        portalVertexShader,
        portalFragmentShader
    );

    extend( {PortalMaterial})
    
    useFrame((state, delta) => {
        portalMaterial.current.uTime += delta
    })

    return <>

        <color args={ ['#030202']} attach="background"/>

        <OrbitControls makeDefault />
        <Center>
            <mesh geometry={nodes.baked.geometry}>
                <meshBasicMaterial map={bakedTexture} />
            </mesh>

            <mesh geometry={nodes.poleLightA.geometry} position={nodes.poleLightA.position}>
                <meshBasicMaterial color="#ffffe5" />
            </mesh>

            <mesh geometry={nodes.poleLightB.geometry} position={nodes.poleLightB.position}>
                <meshBasicMaterial color="#ffffe5" />
            </mesh>

            <mesh geometry={nodes.portalLight.geometry} 
            position={nodes.portalLight.position}
            rotation={nodes.portalLight.rotation}
            >
                <portalMaterial ref={portalMaterial}/>
            </mesh>

            <Sparkles 
                size={6}
                scale={ [4, 2, 4]}
                position-y={1}
                speed={0.2}
                count={40}/>


        </Center>
       
    </>
}