class PictureURL {
  constructor(imageNameWithExt = "") {
    this.url = `${process.env.REACT_APP_SERVER_URL}/photos/${imageNameWithExt}`;
  }
}

export default PictureURL;
