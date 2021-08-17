import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

const Welcome = (props) => (
  <>
    <Typography variant="h3">Welcome to SubFire 4</Typography>
    <Typography variant="h5">
      This project, replacing SubFireLib 3.x as the 4.x tree, will update the
      library to more modern coding standards in browser javascript, react,
      material-ui, and optimizing how a component library can be published.
      Features will include a cleaner API using async/await, better theme
      integration in material-ui, and hooks. Plus the includes in the Storybook
      examples can be used as-is rather than having to add subfirebase/lib to
      everything.
      <p></p>
      This is now being managed as a monorepo where the applications sit with
      the library instead of being separate projects with dependencies.
      <p></p>
      Demos running on server {process.env.sf_server} as{" "}
      {process.env.sf_username}
    </Typography>
    <Typography component="p" style={{ paddingTop: 20 }} variant="body1">
      Areas in the new organization will include
    </Typography>
    <List>
      <ListItem>
        <ListItemText>
          api: The core connectivity to the Subsonic server and radio station
          generation. The primary change is that this layer will be used more
          directly, so individual components can rely on promise handling to
          know the load is finished. This change will resolve a lot of hacky
          code in the current Loader system uses.
        </ListItemText>
      </ListItem>
      <ListItem>
        <ListItemText>
          hooks: The primary interface to the various layers (in effect,
          breaking up the actions and stores of the original library)
        </ListItemText>
      </ListItem>
      <ListItem>
        <ListItemText>utils: Library pieces (some 3rd party)</ListItemText>
      </ListItem>
      <ListItem>
        <ListItemText>
          blocks: Low level rendering items like Grid Cards, List Items
        </ListItemText>
      </ListItem>
      <ListItem>
        <ListItemText>
          controls: Low level pieces for the various actions in controlling the
          player or starting a playing queue.
        </ListItemText>
      </ListItem>
      <ListItem>
        <ListItemText>
          browsers: higher level components for browsing through Playlists,
          Albums, Artist-Albums, etc.
        </ListItemText>
      </ListItem>
      <ListItem>
        <ListItemText>
          loader: standardizing the loading page when transitioning between
          screens.
        </ListItemText>
      </ListItem>
    </List>
    <Typography variant="body1">Specific Hook Categories:</Typography>
    <List>
      <ListItem>
        <ListItemText>Credentials</ListItemText>
      </ListItem>
      <ListItem>
        <ListItemText>Browsing, with improved cacing</ListItemText>
      </ListItem>
      <ListItem>
        <ListItemText>Playing Queue</ListItemText>
      </ListItem>
      <ListItem>
        <ListItemText>Player Status and Controls</ListItemText>
      </ListItem>
      <ListItem>
        <ListItemText>
          Editing Playlist Queue (for building a playlist editor)
        </ListItemText>
      </ListItem>
      <ListItem>
        <ListItemText>
          Editing Radio Station (for replacing the current subfireradio)
        </ListItemText>
      </ListItem>
    </List>
  </>
);


export default {
  title: 'Welcome',
  parameters: { notes: "hi mom"}
};

export const toSubfirelib = () => <Welcome/>;

toSubfirelib.storyName = 'to SubFireLib';
