import { useGLTF, OrbitControls } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { InstancedRigidBodies, CylinderCollider, CuboidCollider, Debug, RigidBody, Physics } from '@react-three/rapier'
import { MeshStandardMaterial } from 'three'
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useState } from 'react';
import { useEffect } from 'react';
import { useMemo } from 'react';

export default function Experience()
{

    const burger = useGLTF("./hamburger.glb")
    
    const twister = useRef();
    const cubesCount = 2000;
    const cubeTransforms = useMemo(() => {
        const positions = [];
        const rotations = [];
        const scales = [];

        for (let i = 0; i < cubesCount; i++){
            positions.push([(Math.random() - 0.5) * 8, 6 + i * 0.2, (Math.random() - 0.5) * 8]);
            rotations.push([Math.random(), Math.random(), Math.random()]);

            const scale = 0.2 + Math.random() * 0.8;
            scales.push([ scale, scale, scale])
        }
        return { positions, rotations, scales}
    },[]);

    const cubes = useRef();


    const cube = useRef();
    const cubeJump = () => {
        const mass = cube.current.mass();
        cube.current.applyImpulse({x: 0, y: 5 * mass, z: 0})
        cube.current.applyTorqueImpulse({
            x: Math.random() - 0.5, 
            y: Math.random() - 0.5, 
            z: Math.random() - 0.5
        })
    }

    const collisionEnter = () => {
        // hitSound.currentTime = 0;
        // hitSound.volume = Math.random();
        // hitSound.play()
    }
    


    // useEffect(() => {
    //     for(let i = 0; i < cubesCount; i++){
    //         const matrix = new THREE.Matrix4()
    //         matrix.compose(
    //             new THREE.Vector3(i * 2, 0, 0),
    //             new THREE.Quaternion(),
    //             new THREE.Vector3(1,1,1)
    //         );


    //         cubes.current.setMatrixAt(i, matrix);
    //     }
    // }, [])

    const [hitSound] = useState(() => { return new Audio('./hit.mp3')})

    useFrame((state, delta) => {
        const time = state.clock.getElapsedTime()

        const eulerRotation = new THREE.Euler(0, 10 * time, 0);
        const quaternionRotation = new THREE.Quaternion();

        quaternionRotation.setFromEuler(eulerRotation);

        twister.current.setNextKinematicRotation(quaternionRotation);

        const angle = time * 0.5;
        const x = Math.cos(angle) * 3;
        const z = Math.sin(angle) * 3;

        twister.current.setNextKinematicTranslation({x: x, y:-0.8, z:z})
    });


    return <>

        <Perf position="top-left" />

        <OrbitControls makeDefault />

        <directionalLight castShadow position={ [ 1, 2, 3 ] } intensity={ 1.5 } />
        <ambientLight intensity={ 0.5 } />

        <Physics>
            <RigidBody colliders="ball">
                <mesh castShadow position={ [ -2, 3, 0 ] }>
                    <sphereGeometry />
                    <meshStandardMaterial color="orange" />
                </mesh>
            </RigidBody>

            <RigidBody ref={cube}
                position={[ 2, 1, 0]}
                restitution={0.5}
                friction={0.7}
                colliders={false}
            >
                <CuboidCollider mass={200} args={[0.5, 0.5, 0.5]} />
                <mesh onClick={cubeJump} castShadow >
                    <boxGeometry/>
                    <meshStandardMaterial color="mediumpurple" />
                </mesh>
            </RigidBody>
            
            

            <RigidBody type="fixed"
            friction={0.7}>
                <mesh receiveShadow position-y={ - 1.25 }>
                    <boxGeometry args={ [ 10, 0.5, 10 ] } />
                    <meshStandardMaterial color="greenyellow" />
                </mesh>
            </RigidBody>

            <RigidBody ref={twister}
                position={[0, -0.8, 0]}
                friction={0}
                type='kinematicPosition'
                onCollisionEnter={collisionEnter}
            >
                <mesh castShadow scale={[0.4, 0.4, 3]} >
                    <boxGeometry />
                    <meshStandardMaterial color="red" />
                </mesh>
            </RigidBody>

            <RigidBody
                colliders= {false}>
                <CylinderCollider args={[0.5, 1.25]} />
                <primitive object={ burger.scene} scale={0.3}/>
            </RigidBody>


            <RigidBody type="fixed">
                <CuboidCollider args={ [ 5, 2, 0.5 ] } position={ [ 0, 1, 5.5 ] } />
                <CuboidCollider args={ [ 5, 2, 0.5 ] } position={ [ 0, 1, - 5.5 ] } />
                <CuboidCollider args={ [ 0.5, 2, 5 ] } position={ [ 5.5, 1, 0 ] } />
                <CuboidCollider args={ [ 0.5, 2, 5 ] } position={ [ - 5.5, 1, 0 ] } />
            </RigidBody>

            <InstancedRigidBodies
                positions={cubeTransforms.positions}
                rotations={cubeTransforms.rotations}
                scales={cubeTransforms.scales}
            >
                <instancedMesh castShadow receiveShadow ref={cubes}
                    args={[null, null, cubesCount]}
                    
                >
                    <boxGeometry />
                    <meshStandardMaterial color="tomato" />

                </instancedMesh>
            </InstancedRigidBodies>
            

        </Physics>

    </>
}