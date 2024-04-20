import PropTypes from 'prop-types';
import Header from "~/layouts/components/Header";
import Footer from "~/layouts/components/Footer";
import NavBar from "~/layouts/components/NavBar";

function DefaultLayout({ children }) {
    return (
        <div>
            <Header />
            <div className="container">
                <NavBar />
                {children}
            </div>
            <Footer />
        </div>
    );
}

DefaultLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default DefaultLayout;