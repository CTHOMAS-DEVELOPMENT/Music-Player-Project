import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";

class Player extends React.Component {
  state = {
    playStatus: "play",
    currentTime: 0
  };

  static defaultProps = {
    track: {
      name: "We Were Young",
      artist: "Odesza",
      album: "Summer's Gone",
      year: 2012,
      artwork:
        "https://funkadelphia.files.wordpress.com/2012/09/odesza-summers-gone-lp.jpg",
      duration: 192,
      source: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/wwy.mp3"
    }
  };

  updateTime = timestamp => {
    timestamp = Math.floor(timestamp);
    this.setState({ currentTime: timestamp });
  };
  updateScrubber = percent => {
    // Set scrubber width
    let innerScrubber = document.querySelector(".Scrubber-Progress");
    innerScrubber.style["width"] = percent;
  };
  togglePlay = () => {
    let status = this.state.playStatus;
    let audio = document.getElementById("audio");
    if (status === "play") {
      status = "pause";
      audio.play();
      let that = this;
      setInterval(function() {
        let currentTime = audio.currentTime;
        let duration = that.props.track.duration;

        // Calculate percent of song
        let percent = (currentTime / duration) * 100 + "%";
        that.updateScrubber(percent);
        that.updateTime(currentTime);
      }, 100);
    } else {
      status = "play";
      audio.pause();
    }
    this.setState({ playStatus: status });
  };

  render() {
    return (
      <div className="Player">
        <div
          className="Background"
          style={{ backgroundImage: "url(" + this.props.track.artwork + ")" }}
        />
        <div className="Header">
          <div className="Title">
            <TrackInformation track={this.props.track} />
          </div>
        </div>
        <div
          className="Artwork"
          style={{ backgroundImage: "url(" + this.props.track.artwork + ")" }}
        />
        <Scrubber />
        <Controls isPlaying={this.state.playStatus} onClick={this.togglePlay} />
        <Timestamps
          duration={this.props.track.duration}
          currentTime={this.state.currentTime}
        />

        <audio id="audio">
          <source src={this.props.track.source} />
        </audio>
      </div>
    );
  }
}

class TrackInformation extends React.Component {
  render() {
    return (
      <div className="TrackInformation">
        <div className="Name">Title: {this.props.track.name}</div>
        <div className="Artist">Artist: {this.props.track.artist}</div>
        <div className="Album">
          {this.props.track.album} ({this.props.track.year})
        </div>
      </div>
    );
  }
}
class Scrubber extends React.Component {
  render() {
    return (
      <div className="Scrubber">
        <div className="Scrubber-Progress" />
      </div>
    );
  }
}
class Controls extends React.Component {
  render() {
    let classNames;
    if (this.props.isPlaying === "pause") {
      classNames = "fa fa-fw fa-pause";
    } else {
      classNames = "fa fa-fw fa-play";
    }
    classNames += " pointer";
    let buttonText =
      this.props.isPlaying.charAt(0).toUpperCase() +
      this.props.isPlaying.slice(1);
    return (
      <div className="Controls">
        <div onClick={this.props.onClick} className="Button">
          <i className={classNames}>{buttonText}</i>
        </div>
      </div>
    );
  }
}
class Timestamps extends React.Component {
  convertTime = timestamp => {
    let minutes = Math.floor(timestamp / 60);
    let seconds = timestamp - minutes * 60;
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    timestamp = minutes + ":" + seconds;
    return timestamp;
  };
  render() {
    return (
      <div className="Timestamps">
        <div className="Time Time--current">
          {this.convertTime(this.props.currentTime)}
        </div>
        <div className="Time Time--total">
          Duration: {this.convertTime(this.props.duration)}
        </div>
      </div>
    );
  }
}

// Render the UI
ReactDOM.render(<Player />, document.querySelector("body"));
