import Container from "../Container";
import Categories from "./Categories";
import Locations from "./Locations";

function LocationsCategories() {
    const title = "Helyszínek-Kategóriák"
    return (
        <Container title={title}>
            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <Locations />
                </div>
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <Categories />
            </div>
            </div >
        </Container>
  );
}

export default LocationsCategories;