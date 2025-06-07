'use client'
import React, { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import './styles/Crystals3D.scss'




//*******************************************************
//Créer un crystal 3D
//*******************************************************
export default function Crystals3D() {
  return (
    // Diminue la hauteur à 250px par ex.
    <div style={{ width: '300px', height: '250px', marginTop: '10px' }}>
      <Canvas>
        {/* Lumières de la scène */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={0.8} />
        
        <CrystalsModel />

        {/* Limiter la rotation à l'horizontale */}
        <OrbitControls
          enableZoom={false}
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  )
}


//*******************************************************
// Modèle 3D des cristaux
//*******************************************************
function CrystalsModel() {
  const { scene } = useGLTF('/models/blue_crystals.glb')
  const ref = useRef<THREE.Group>(null)

  useEffect(() => {
    if (!scene) return

    // Récupère les variables CSS
    const rootStyles = getComputedStyle(document.documentElement)
    // Choisissons le plus clair pour un rendu "plus lumineux"
    const bleuClairCrystal = rootStyles.getPropertyValue('--bleu-clair-crystal').trim()

    scene.traverse((obj: THREE.Object3D) => {
      // Vérifier que c'est un Mesh
      if (obj instanceof THREE.Mesh) {
        const mesh = obj
        const material = mesh.material as THREE.MeshStandardMaterial
        
        // Appliquer la couleur
        material.color.set(bleuClairCrystal)
        material.color.convertSRGBToLinear()

        // Ajuste un peu la brillance
        material.metalness = 0.2
        material.roughness = 0.3

        // S'assure que la texture utilise sRGB
        if (material.map) {
          material.map.colorSpace = THREE.SRGBColorSpace
          material.map.needsUpdate = true
        }
        material.needsUpdate = true
      }
    })
  }, [scene])

  // Rotation auto sur l'axe Y
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.3
    }
  })

  // On décale légèrement le modèle vers le haut pour réduire l'espace en bas.
  return (
    <group ref={ref} position={[0, 0.2, 0]} scale={[0.5, 0.5, 0.5]}>
      <primitive object={scene} />
    </group>
  )
}
