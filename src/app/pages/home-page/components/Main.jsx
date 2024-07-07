import '../../../shared-styles/App.css';
import React from 'react';
const MoviesFetcher = React.lazy(() => import('../../../shared-components/content-fetcher/MoviesFetcher.jsx'));

function Main() {

  return(
    <section className="home-container">
      <div className="home-container">

          <MoviesFetcher page='1' sectionTitle='lançamentos' genre='lançamentos'/>
        
          <MoviesFetcher page='1' sectionTitle={28} genre={28}/>
        
          <MoviesFetcher page='1' sectionTitle={27} genre={27}/>
        
          <MoviesFetcher page='1' sectionTitle={16} genre={16}/>
        
          <MoviesFetcher page='1' sectionTitle={878} genre={878}/>
        
          <MoviesFetcher page='1' sectionTitle={10752} genre={10752}/>
        
          <MoviesFetcher page='1' sectionTitle={35} genre={35}/>
        
          <MoviesFetcher page='1' sectionTitle={99} genre={99}/>

      </div>
    </section>
  )
}

export default Main;