// components/Layout.js
import React, { Component } from 'react';
import Head from './Head';
import Footer from './Footer'
import Header from './Header'
export default function Layout({children}) {
    return (
      <div className='layout'>
        <Head />
        <Header />
        {children}
        <Footer />
      </div>
    );
}