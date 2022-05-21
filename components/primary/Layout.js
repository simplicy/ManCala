// components/Layout.js
import React from 'react';
import Head from './Head';
import Header from './Header'
import Spacer from './Spacer'

export default function Layout({children}) {

  return (
    <div className='layout'>
      <Head   />
      <Header />
      {children}
      <Spacer />
    </div>
  );
}
