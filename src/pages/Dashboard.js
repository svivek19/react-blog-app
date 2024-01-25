import React, { useEffect, useState } from 'react';
import { BallTriangle } from 'react-loader-spinner';

const Dashboard = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setLoading(false);
        }, 2000);

        return () => clearTimeout(timeoutId);
    }, []);

    console.log('dashboard');

    return (
        <div className='w-11/12 md:w-5/6 mx-auto'>
            {loading ? (
                <div className="flex items-center justify-center h-4/5">
                    <div className="text-center">
                        <BallTriangle
                            height={100}
                            width={100}
                            radius={5}
                            color="#1d1d1d"
                            ariaLabel="ball-triangle-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                            visible={true}
                        />
                    </div>
                </div>
            ) : (
                <div>
                    
                </div>
      )}
        </div>

    );
};

export default Dashboard;
