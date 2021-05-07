import React from 'react';
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button
} from 'reactstrap';

class CardProduct extends React.Component {
    constructor(props) {
        console.log("card", props.dataProduct)
        super(props);
        this.state = {}
    }
    render() {
        if (this.props.dataProduct) {
            return (
                <div className="col-md-3">
                    <Card>
                        <CardImg top width="100%" src="/assets/318x180.svg" alt="Card image cap" />
                        <CardBody>
                            <CardTitle tag="h5" style={{ fontWeight: 'bolder' }}>Nama</CardTitle>
                            <CardSubtitle tag="h6" className="mb-2 text-muted">Kategori</CardSubtitle>
                            <CardText tag="h5" style={{ fontWeight: 'bolder' }}>Rp. 799.000</CardText>
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
            );
        }
    }
}

export default CardProduct;