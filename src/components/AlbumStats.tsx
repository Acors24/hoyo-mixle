import { FiDatabase } from "react-icons/fi";
import Dialog from "./Dialog";
import genshinImpactAlbums from "../assets/albums/genshin-impact.json";
import honkaiStarRailAlbums from "../assets/albums/honkai-star-rail.json";
import zenlessZoneZeroAlbums from "../assets/albums/zenless-zone-zero.json";
import genshinImpactIcon from "../assets/icons/genshin-impact.png";
import honkaiStarRailIcon from "../assets/icons/honkai-star-rail.png";
import zenlessZoneZeroIcon from "../assets/icons/zenless-zone-zero.png";
import { Album } from "../types";

function getAlbumCount(albums: Album[]) {
  return albums.length;
}

function getSongCount(albums: Album[]) {
  return albums.reduce((acc, album) => acc + album.songs.length, 0);
}

function getTypeCount(albums: Album[]) {
  const types = new Set<string>();
  albums.forEach((album) => {
    album.songs.forEach((song) => {
      types.add(song.type);
    });
  });
  return types.size;
}

function getRegionCount(albums: Album[]) {
  const regions = new Set<string>();
  albums.forEach((album) => {
    album.songs.forEach((song) => {
      regions.add(song.region);
    });
  });
  return regions.size;
}

export default function AlbumStats() {
  const rows = [
    {
      icon: genshinImpactIcon,
      albums: genshinImpactAlbums,
    },
    {
      icon: honkaiStarRailIcon,
      albums: honkaiStarRailAlbums,
    },
    {
      icon: zenlessZoneZeroIcon,
      albums: zenlessZoneZeroAlbums,
    },
  ];

  return (
    <Dialog title="Album Stats" icon={<FiDatabase />}>
      <div className="overflow-auto">
        <table>
          <thead>
            <tr className="*:px-4 *:py-2">
              <th></th>
              <th>Albums</th>
              <th>Songs</th>
              <th>Types</th>
              <th>Regions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="*:px-4 *:py-2">
                <td>
                  <img src={row.icon} alt="" className="w-10 min-w-6 rounded" />
                </td>
                <td>{getAlbumCount(row.albums)}</td>
                <td>{getSongCount(row.albums)}</td>
                <td>{getTypeCount(row.albums)}</td>
                <td>{getRegionCount(row.albums)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Dialog>
  );
}
