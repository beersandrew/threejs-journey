import { MeshReflectorMaterial, Float, Text, TransformControls, OrbitControls, PivotControls, Html } from '@react-three/drei'
import { useRef } from 'react'

export default function Experience()
{
    const cube = useRef();
    const sphere = useRef();

    return <>

        <OrbitControls makeDefault/>
        <directionalLight position={ [ 1, 2, 3 ] } intensity={ 1.5 } />
        <ambientLight intensity={ 0.5 } />

        <PivotControls anchor={[0, 0, 0]} depthTest= {false}>
            <mesh ref={sphere} position-x={ - 2 }>
                <sphereGeometry />
                <meshStandardMaterial color="orange" />
                <Html
                    position={[1, 1, 0]}
                    wrapperClass='label'
                    center
                    distanceFactor={6}
                    occlude={[sphere, cube]}> That's a sphere </Html>
            </mesh>
        </PivotControls>

        <mesh ref={cube} position-x={ 2 } scale={ 1.5 }>
            <boxGeometry />
            <meshStandardMaterial color="mediumpurple" />
        </mesh>

        <TransformControls object={cube} mode="translate"/>

        <mesh position-y={ - 1 } rotation-x={ - Math.PI * 0.5 } scale={ 10 }>
            <planeGeometry />
            <MeshReflectorMaterial 
                resolution={512}
                blur={[1000,1000]}
                mixBlur={0}
                mirror={0.75}
                color="greenyellow"
            />
        </mesh>

        <Float
            speed={4}
            floatIntensity={2}
        >

        
            <Text
                font="./bangers-v20-latin-regular.woff"
                color="salmon"
                position-y={2}
                > 
                    I Love R3F
                    <meshNormalMaterial/>
                </Text>
        </Float>

    </>
}