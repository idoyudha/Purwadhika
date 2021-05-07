import React from 'react';
import {
    Container, Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button, Input
} from 'reactstrap';
import CarousleComp from '../components/carousle';
import { connect } from 'react-redux'
import Slider from 'react-slick'
class LandingPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    printProducts = () => {
        if (this.props.products.length > 0) {
            return this.props.products.map((item, index) => {
                return <div >
                    <Card style={{ border: 'none' }}>
                        <CardImg top width="100%" src={item.images[0]} alt="Card image cap" />
                        <CardBody>
                            <CardTitle tag="h5" style={{ fontWeight: 'bolder' }}>{item.nama}</CardTitle>
                            <CardSubtitle tag="h6" className="mb-2 text-muted">{item.kategori}</CardSubtitle>
                            <CardText tag="h5" style={{ fontWeight: 'bolder' }}>Rp. {item.harga.toLocaleString()}</CardText>
                            <Button type="button" outline
                                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span class="material-icons">
                                    visibility
                        </span>
                                <span>Lihat Sekilas</span>
                            </Button>
                        </CardBody>
                    </Card>
                </div>
            })
        }
    }

    render() {
        const settings = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 3,
        }
        return (
            <Container fluid>
                <CarousleComp />
                <Slider {...settings}>
                    {this.printProducts()}
                </Slider>
            </Container>
        );
    }
}

const mapToProps = ({ productReducers }) => {
    return {
        products: productReducers.products_list
    }
}

export default connect(mapToProps)(LandingPage);