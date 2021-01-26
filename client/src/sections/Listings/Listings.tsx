import React from "react";
import { useQuery, useMutation } from "react-apollo";
import { Spinner } from "../../components";
import { Listings as ListingsData } from "./__generated__/Listings";
import {
  DeleteListing as DeleteListingData,
  DeleteListingVariables,
} from "./__generated__/DeleteListing";
import { gql } from "apollo-boost";

const LISTINGS = gql`
  query Listings {
    listings {
      id
      title
      image
      address
      price
      numOfGuests
      numOfBaths
      numOfBeds
      rating
    }
  }
`;

interface Props {
  title: string;
}

const DELETE_LISTING = gql`
  mutation DeleteListing($id: ID!) {
    deleteListing(id: $id) {
      id
      title
    }
  }
`;

export const Listings: React.FC<Props> = ({ title }: Props) => {
  const { data, loading, refetch } = useQuery<ListingsData>(LISTINGS);

  const [
    deleteListing,
    { loading: deleteListingLoading, error: deleteListingError },
  ] = useMutation<DeleteListingData, DeleteListingVariables>(DELETE_LISTING);

  const handleDeleteListing = React.useCallback(
    async (event) => {
      const id: string = event.currentTarget.dataset.id;

      await deleteListing({ variables: { id } });

      await refetch();
    },
    [deleteListing, refetch]
  );

  const listings = (data && data.listings) || [];

  const deleteListingLoadingMsg = deleteListingLoading ? (
    <h4>Deletion in progress</h4>
  ) : null;

  const deleteListingErrorMsg = deleteListingError ? (
    <h4>Uh oh! Something went wrong with deletion</h4>
  ) : null;

  return (
    <div className="row">
      <h2>{title}</h2>
      {deleteListingLoadingMsg}
      {deleteListingErrorMsg}
      <p>Amount of Listings: {listings.length}</p>
      {loading && <Spinner />}
      {!loading && data && (
        <ul className="collection with-header">
          <li className="collection-header">My Listings</li>
          {listings.map((listing) => {
            return (
              <li key={listing.id} className="collection-item">
                <div>
                  {listing.title}{" "}
                  <a
                    className="secondary-content"
                    href="/delete "
                    data-id={listing.id}
                    onClick={handleDeleteListing}
                  >
                    <i className="material-icons purple-text text-darken-2">
                      delete_forever
                    </i>
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
