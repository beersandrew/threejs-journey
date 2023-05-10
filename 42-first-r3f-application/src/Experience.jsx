import { extend, useFrame, useThree } from "@react-three/fiber"
import { useRef } from 'react'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import CustomObject from './CustomObject'

export default function Experience()
{

    extend({OrbitControls: OrbitControls});

    const cubeRef = useRef();
    const groupRef = useRef();

    const {camera, gl} = useThree();
    useFrame((state, delta) => {
        cubeRef.current.rotation.y += delta;
        groupRef.current.rotation.y += delta;

        const angle = state.clock.elapsedTime;

        // state.camera.position.x = Math.sin(angle) * 8
        // state.camera.position.z = Math.cos(angle) * 8
        // state.camera.lookAt(0, 0, 0)
    })

    return <>

        <orbitControls args={[camera, gl.domElement]}/>

        <directionalLight intensity={1.5} position={[1,2,3]}/>
        <ambientLight  intensity={0.5} />

        <group ref={groupRef}>
            <mesh position-x={-2}>
                <sphereGeometry args={[1, 32, 32]}/>
                <meshBasicMaterial color="#ff0000"/>
            </mesh>

            <mesh ref={cubeRef} position-x={2} >
                <boxGeometry/>
                <meshStandardMaterial color="mediumpurple"/>
            </mesh>
        </group>

        <mesh  rotation-x={-Math.PI * 0.5} position-y={-1} scale={10}>
            <planeGeometry/>
            <meshStandardMaterial color="greenyellow"/>
        </mesh>

        <CustomObject />
    </>
}