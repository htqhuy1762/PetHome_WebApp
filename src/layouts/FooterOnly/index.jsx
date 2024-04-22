import PropTypes from 'prop-types';
import Footer from '~/layouts/components/Footer';

function FooterOnly({ children }) {
    return (
        <div>
            <div className="container">
                <div className="content">{children}</div>
            </div>
            <Footer/>
        </div>
    );
}

FooterOnly.propTypes = {
    children: PropTypes.node.isRequired,
};

export default FooterOnly;