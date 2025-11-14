import React from 'react'
import HeroSection from '../../components/landing/HeroSection'
import FeatureCards from '../../components/landing/FeatureCards'
import MenuSection from '../../components/landing/MenuSection'
import AboutSection from '../../components/landing/AboutSection'
import ContactSection from '../../components/landing/ContactSection'
import FooterSection from '../../components/landing/FooterSection'

export default function Home() {
    return (
        <>
            <HeroSection />
            <FeatureCards />
            <MenuSection />
            <AboutSection />
            <ContactSection />
            <FooterSection />
        </>
    )
}
