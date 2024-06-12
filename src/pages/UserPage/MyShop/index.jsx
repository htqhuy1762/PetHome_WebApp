import * as shopServices from '~/services/shopServices';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '~/components/Loading';

function MyShop() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchShop = async () => {
            try {
                let isRegister = false;
                let isActive = false;

                const responseIsRegister = await shopServices.checkIsRegisterShop();
                const responseIsActive = await shopServices.checkIsActiveShop();

                if (responseIsRegister.status === 200 || responseIsRegister.status === 201) {
                    if (responseIsRegister.data.message === 'User is shop owner') {
                        localStorage.setItem('idShop', responseIsActive.data.id_shop);
                        isRegister = true;
                    } else {
                        isRegister = false;
                    }
                }
                else {
                    isRegister = false;
                }

                if (responseIsActive.status === 200 || responseIsActive.status === 201) {
                    if (responseIsActive.data.status === 'active') {
                        isActive = true;
                    } else {
                        isActive = false;
                    }
                }
                else {
                    isActive = false;
                }

                if (isRegister) {
                    if (isActive) {
                        navigate('/user/shop/management');
                    } else {
                        navigate('/user/shop/complete');
                    }
                }
                else {
                    navigate('/user/shop/subcribe');
                }

            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        fetchShop();
    });

    if (loading) {
        return <Loading />;
    }

    return <div></div>;
}

export default MyShop;