'use client'
import React from 'react'
import styles from './styles/CrystalEmbed.module.css'

export default function CrystalEmbed() {
  return (
    <div className={styles.embedWrapper}>
      <iframe
        title="Animated Crystal"
        src="https://sketchfab.com/models/b0d04fbd1dd24da899048cbae316f5f4/embed?
        transparent=1
        &ui_watermark=0
        &ui_watermark_link=0
        &ui_infos=0
        &ui_hint=0"
        allow="autoplay; fullscreen; xr-spatial-tracking"
        allowFullScreen
        frameBorder="0"
        {...{ mozallowfullscreen: 'true', webkitallowfullscreen: 'true' }}
        className={styles.iframe}
      />
      <p className={styles.credits}>
        <a href="https://sketchfab.com/3d-models/animated-crystal-b0d04fbd1dd24da899048cbae316f5f4" target="_blank" rel="nofollow">
          animated crystal
        </a> by <a href="https://sketchfab.com/markskovrup" target="_blank" rel="nofollow">
          markskovrup
        </a> on <a href="https://sketchfab.com" target="_blank" rel="nofollow">
          Sketchfab
        </a>
      </p>
    </div>
  )
}
