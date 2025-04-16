import Image from 'next/image';
import './FollowTrophy.css';

const FollowTrophy = () => {
    return (
        <section className="followTrophy">
            <div className="TitleStyle">
                <div className="shapeLeft">
                    <h2 className="Title2-Karantina titleTrophy"> Relève des défis et prouve ta valeur !</h2>
                </div> 
                <div className="shapeRight">
                
                </div> 
            </div>

            <div>
                <div>
                    <Image
                        src="/images/NoLogin/Trophy.png"
                        alt="Trophy"
                        width={200}
                        height={200}
                        className="trophyImage"
                    />
                </div>
            </div>


        </section>
    );
};

export default FollowTrophy;