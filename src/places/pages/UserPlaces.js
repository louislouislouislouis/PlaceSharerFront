import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ErrorModal from "../../shared/components/UIElement/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElement/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

import PlaceList from "../components/PlaceList";

const UserPlaces = (props) => {
  const userId = useParams().userId;
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [userPlaces, setUserPlaces] = useState();
  useEffect(() => {
    const fetchUsersPlace = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`
        );
        setUserPlaces(responseData.places);
      } catch (err) {}
    };
    fetchUsersPlace();
  }, [sendRequest, userId]);
  const placeDeletedHandler = (deletedplaceeID) => {
    setUserPlaces((prevPlaces) =>
      prevPlaces.filter((place) => place.id !== deletedplaceeID)
    );
  };
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && userPlaces && (
        <PlaceList items={userPlaces} onDeleteplace={placeDeletedHandler} />
      )}
    </React.Fragment>
  );
};

export default UserPlaces;
