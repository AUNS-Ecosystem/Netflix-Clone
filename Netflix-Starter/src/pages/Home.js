import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import { Logo } from "../images/Netflix";

import { ConnectButton, TabList, Tab, Button, Modal, useNotification } from "web3uikit";
import { movies } from "../helpers/library";
import { useState } from "react";
import { useMoralis } from "react-moralis";


const Home = () => {

  const [visible, setVisible] = useState(false);
  const [selectedFilm, setSelectedFilm] = useState();
  const { isAuthenticated, Moralis, account } = useMoralis();
  const [myMovies, setMyMovies] = useState();

  useEffect(() => {
    async function fetchMyList() {
      //   await Moralis.start({
      //   serverUrl: "",
      //   appId: "",
      // }); //if getting errors add this 
      // console.log(account)
      const theList = await Moralis.Cloud.run("getMyList",{addrs: account})
      const filterA = movies.filter(function (e) {
        return theList.indexOf(e.Name) > -1;
      })
      setMyMovies(filterA)  
    }
    if(isAuthenticated) {
      fetchMyList();  
    }
    console.log(isAuthenticated);    
  },[account, isAuthenticated])

  const dispatch = useNotification();

  const handleNewNotification = () => {
    dispatch({
      type: "error",
      message: "Please Connect Your Crypto Wallet",
      title: "Not Authenticated",
      position: "topL",
    });
  };
  const handleAddNotification = () => {
    dispatch({
      type: "success",
      message: "Movie Added to List",
      title: "Success",
      position: "topL",
    });
  };

return(
  <>
    <div className="logo1">
          <Logo />
    </div>

    <div className="connect">
          <ConnectButton />
    </div>
      
      <div className="topBanner">
       <TabList defaultActiveKey={1} tabStyle="bar">
            <Tab tabKey={1} tabName={"Home"}> 
              <div className="scene">
                    <img src={movies[0].Scene} className="sceneImg"></img>
                    <p className="sceneDesc">{movies[0].Description}</p>
                  <div className="playButton">
                    

                    <Button
                  icon="plus"
                  text="Add to My List"
                  theme="translucent"
                  type="button"
                  onClick={async() =>{
                    if (isAuthenticated) {
                      await Moralis.Cloud.run("updateMyList", {
                        addrs: account,
                        newFav: movies[0].Name
                      })
                      handleAddNotification();
                    } else {
                      handleNewNotification();
                    }
                    
                  }} />
                 </div>
              </div> 

            <div className="title">
             All Videos
            </div>

            <div className="thumbs">

              {movies &&
                movies.map((e) => {

                  return (
                    <img
                      src={e.Thumnbnail}
                      className="thumbnail"
                      onClick={() => {
                        setSelectedFilm(e);
                        setVisible(true);
                      }}
                    ></img>
                  );
                })}
            </div>
            <div className="creatorscene2">
             <img src="https://img1.wsimg.com/isteam/ip/e3f17df6-db9a-4fa4-b6e1-f7337e6674cd/Studio-Project%20(1)-0001.png/:/cr=t:0%25,l:0.02%25,w:99.95%25,h:99.95%25/rs=w:600,cg:true,m" className="Creatorimg2"></img>
              </div>

            </Tab>
            
            <Tab tabKey={2} tabName={"AUNS Originals"}> 
             <div className="creatorscene">
             <img src="https://img1.wsimg.com/isteam/ip/e3f17df6-db9a-4fa4-b6e1-f7337e6674cd/Studio-Project%20(1)-0001.png/:/cr=t:0%25,l:0.02%25,w:99.95%25,h:99.95%25/rs=w:600,cg:true,m" className="Creatorimg"></img>
              </div> 
            </Tab>


          <Tab tabKey={3} tabName={"MyList"}>

          <div className="ownListContent">
              <div className="title1">Your Library</div>
              {myMovies && isAuthenticated ? (
                <>
                  <div className="ownThumbs">
                    {
                      myMovies.map((e,i) => {
                        return (
                          <img
                            src={e.Thumnbnail}
                            className="thumbnail" alt="" key={i}
                            onClick={() => {
                              setSelectedFilm(e);
                              setVisible(true);
                            }}
                          ></img>
                        );
                      })}
                  </div>
                </>
              ) : (
                <div className="ownThumbs">
                  You need to Authenicate To view Your Library
                </div>
              )}
            </div>

          </Tab>
        </TabList>
        {selectedFilm && (
          <div className="modal">
              <Modal
                onCloseButtonPressed={() => setVisible(false)}
                isVisible={visible}
                hasFooter={false}
                width="100%"
              >

                <div className="modalContent">
                    <img src={selectedFilm.Scene} className="modalImg"></img>
                    <div className="modalplayButton">
                        {isAuthenticated ? (
                                    <>
                              <Link to="/player" state={selectedFilm.Movie}>
                              <Button
                              icon="chevronRightX2"
                              iconLayout="icon-only"
                              id="test-button-primary-icon-only"
                              onClick={function noRefCheck(){}}
                              size="large"
                              text="Primary icon only"
                              theme="primary"
                              type="button"
                              />
                              </Link>

                              <Button
                              icon="plus"
                              text="Add to My List"
                              theme="translucent"
                              type="button"
                              onClick={async () => {
                                await Moralis.Cloud.run("updateMyList", {
                                  addrs: account,
                                  newFav: selectedFilm.Name,
                                });
                                handleAddNotification();
                              }}

                                  />
                                </>

                        ) : (

                         <>
                          <Button
                           icon="chevronRightX2"
                           iconLayout="icon-only"
                           id="test-button-primary-icon-only"
                           
                           size="large"
                           text="Primary icon only"
                           theme="primary"
                           type="button"
                           onClick={handleNewNotification}
                          />
                         
      
                          <Button
                        icon="plus"
                        text="Add to My List"
                        theme="translucent"
                        type="button"
                        onClick={handleNewNotification}
                        
                              />
                          </>

                        )}

                     
                  </div>
                </div>

                <div className="movieInfo">
                  <div className="description">
                    <div className="details">
                  
                      <span>{selectedFilm.Duration}</span>
                    </div>
                    {selectedFilm.Description}
                  </div>
                  
                </div>

              </Modal>
           </div>
        )}

      </div>
  
  </>
)
}

export default Home;
