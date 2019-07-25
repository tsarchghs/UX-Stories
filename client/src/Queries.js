import gql from "graphql-tag";

const getObjectConnectionQuery = gql`
  query GetObjectConnection(
  	$connection_type: CONNECTION_TYPE!
  	$fields: [String!]!
  	$filterBy: [Dict!]
  	$where: [Dict!]
  ) {
    getObjectConnection(
		connection_type: $connection_type
		fields: $fields
		filterBy: $filterBy
		where: $where
    ) {
      id
      pageInfo{
        hasNextPage
      }
      nodes {
        repr
      }
    }
 }
`

const LIBRARIES_QUERY_SHALLOW = gql`
	query Libraries(
		$libraryFilterInput: LibraryFilterInput
	){
		libraries(
			libraryFilterInput: $libraryFilterInput
		) {
			id
			name
		}
	}
`

const LIBRARIES_QUERY = gql`
  query {
      libraries {
        id
        name
        stories {
          id
          thumbnail {
            id
            url
          }
        }
      }
    }
`

const APPS_QUERY = gql`
  query Apps(
    $appFilterInput: AppFilterInput 
  ) {
    apps(appFilterInput: $appFilterInput){
        id
        name
        description
        logo {
          id
          url
        }
        stories(first:3) {
          id
          thumbnail {
            id
            url
          }
        }
        appCategory {
          id
          name
        }
        company
      }
    }
`
const UPDATE_ALGOLIA_INDEX_QUERY = gql`
  mutation UpdateAlgoliaIndex(
    $indexName: String!
    $object_id: ID!
  ) {
     updateAlgoliaIndex(
       indexName: $indexName,
       object_id: $object_id
     ) {
       success
     }
  }
`

const DELETE_ALGOLIA_INDEX_QUERY = gql`
  mutation DeleteAlgoliaIndex(
    $indexName: String!
    $object_id: ID!
  ) {
     deleteAlgoliaIndex(
       indexName: $indexName,
       object_id: $object_id
     ) {
       success
     }
  }
`
const ADD_ALGOLIA_INDEX_QUERY = gql`
  mutation AddAlgoliaIndex(
    $indexName: String!
    $object_id: ID!
  ) {
     addAlgoliaIndex(
       indexName: $indexName,
       object_id: $object_id
     ) {
       success
     }
  }
`
const DELETE_LIBRARY_MUTATION = gql`
  mutation DeleteLibrary(
    $id: ID!
  ){
    deleteLibrary(
      id: $id
    ) {
      id
    }
  }
`

const GET_LOGGED_IN_USER_QUERY = gql`                                    
  query {
    getLoggedInUser{
      id
      full_name
      email
      role
      google_accessToken
      subscription {
        id
        status
        cancel_at_period_end
      }
      job {
          id
          name
      }
      profile_photo {
        id
        url
      }   
      subscription {
        id
        status
      }
    }
  }
`

const GET_INVOICES_QUERY = gql`
  query {
    getLoggedInUser{
      id
      invoices {
        id
        total
        status
        last4
        hosted_invoice_url
      }
    }
  }
`

const GET_CUSTOMER_INFO = gql`
  query {
    getLoggedInUser {
      id
      customer {
        id
        source {
          id
          last4
          exp_month
          exp_year
          brand
        }
      }
    }
  }
`

const TOGGLE_STORY_LIBRARY_MUTATION = gql`
  mutation ToggleStoryLibrary(
    $library: ID!
    $story: ID!
  ) {
    toggleStoryLibrary(
      library: $library
      story: $story
    ){
      action
    }
  }
`

const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword(
    $token: String!
    $new_password: String!
    $repeat_new_password: String!
  ){
    resetPassword(
      token: $token
      new_password: $new_password
      repeat_new_password: $repeat_new_password
    ){
      success
    }
  }
`

const VERIFY_FORGOT_PASSWORD_MUTATION = gql`
  mutation VerifyForgotPassword(
    $token: String!
  ){
    verifyForgotPassword(
      token: $token
    ){
      valid
    }
  }
`

const APP_QUERY = gql`
  query App(
    $id: ID!
  ){
    app(
      id: $id
    ){
      id
      name
      description
      company
      appVersions { 
        id
        name
      }
      appCategory {
        id
        name
      }
      logo {
        id
        url
      }
    }
  }
`

const STORIES_QUERY = gql`
  query Stories(
    $storiesFilterInput: StoriesFilterInput
  ) {
    stories(
      storiesFilterInput: $storiesFilterInput
    ) {
      id
      thumbnail {
        id
        url
      }
    }
  }
`

const STORIES_QUERY_WITH_APP = gql`
  query Stories(
    $storiesFilterInput: StoriesFilterInput
  ) {
    stories(
      storiesFilterInput: $storiesFilterInput
    ) {
      id
      app {
        id
        name
        description
      }
      thumbnail {
        id
        url
      }
    }
  }
`

const STORY_QUERY = gql`
  query Story(
    $id: ID!
  ){
    story(
      id: $id
    ){
        id
        thumbnail {
          id
          url
        }
        app {
          id
          name
          description
          logo {
            id
            url
          }
        }
        storyElements {
          id
          name
        }
        storyCategories {
          id
          name
        }
        video {
          id
          file {
            id
            url
            mimetype
          }
        }
    }
  }
`

const JOBS_QUERY = gql`
  query {
    jobs {
      id
      name
    }
  }
`
const SIGN_UP_MUTATION = gql`
  mutation SignUp(
    $full_name: String!, $email: String!, 
    $password: String!,$job: ID
    $google_accessToken: String
    $facebook_accessToken: String
    $profile_photo: FileInput
  ) {
    signUp(
      full_name: $full_name
      email: $email
      password: $password
      google_accessToken: $google_accessToken
      facebook_accessToken: $facebook_accessToken
      job: $job
      profile_photo: $profile_photo
    ) {
      token
    }
  } 
`
const LOGIN_MUTATION = gql`
    mutation Login($email: String!, $password: String!){
      login(email: $email, password: $password) {
        token
      }
    }
`
const LIBRARY_QUERY = gql`
  query Library(
    $id: ID!
  ){
    library(
      id: $id
    ){
      id
      name
      stories {
        id
        thumbnail {
          id
          url
        }
      }
    }
  }
`

const FORGET_PASSWORD_MUTATION = gql`
  mutation ForgetPassword(
    $email: String!
  ){
    forgetPassword(
      email: $email
    ){
      success
    }
  }
`

const EDIT_PROFILE_MUTATION = gql`
    mutation EditProfile(
      $full_name: String
      $job: ID
      $email: String
      $profile_photo: FileInput
      $password: String
    ){
      editProfile(
        full_name: $full_name
        job: $job
        email: $email
        profile_photo: $profile_photo
        password: $password 
      ) {
        id
        profile_photo {
          id
          url
        }
      }
    }
`

const EDIT_LIBRARY_MUTATION = gql`
    mutation EditLibrary(
              $id: ID!
              $name:String!
              $stories: [StoryLinkType!]
            ){
      editLibrary(
                id: $id
                name: $name
                stories: $stories
      ) {
                id
                name
                stories {
                    id
                    thumbnail {
                      id
                      url
                    }
                }
            }
    }
`

const CREATE_LIBRARY_MUTATION = gql`
    mutation CreateLibrary($name:String!){
      createLibrary(
        name: $name
      ) {
                id
                name
                stories {
                  thumbnail {
                  url
                }
              }
            }
    }
`

const STORY_CATEGORIES_QUERY = gql`
  query StoryCategories (
    $app: ID
    $library: ID
  ){
    storyCategories(
      app: $app
      library: $library
    ) {
      id
      name
    }
  }
`

const STORY_ELEMENTS_QUERY = gql`
    query StoryElements(
      $app: ID
      $library: ID
    ){
      storyElements(
        app: $app
        library: $library
      ) {
        id
        name
      }
    }
`

const APP_VERSIONS_QUERY = gql`
  query AppVersions (
    $app: ID
  ){
    appVersions(
      app: $app
    ) {
      id
      name
    }
  }
`

const APP_CATEGORIES_QUERY = gql`
    query {
      appCategories{
        id
        name
      }
    }
`

const PAYMENT_MUTATION = gql`
  mutation Payment(
    $stripe_token: String!
  ){
    payment(
      stripe_token: $stripe_token
    ){
      id
      status
      cancel_at_period_end
    }
  }
`

const CANCEL_SUBSCRIPTION_MUTATION = gql`
  mutation  {
    cancelSubscription {
      id
      status
      cancel_at_period_end
    }
  }
`

const RENEW_SUBSCRIPTION_MUTATION = gql`
  mutation  {
    renewSubscription {
      id
      status
      cancel_at_period_end
    }
  }
`

const LOGIN_WITH_GOOGLE_MUTATION = gql`
  mutation LoginWithGoogle(
    $google_accessToken: String!
  ) {
      loginWithGoogle(
        google_accessToken: $google_accessToken
      ) {
        token
      }
  }
`

const UPDATE_CARD_MUTATION = gql`
  mutation UpdateCard(
    $stripe_token: String!
  ){
    updateCard(
      stripe_token: $stripe_token
    ){
      id
      last4
      exp_month
      exp_year
      brand
    }
  }
`

const SAVE_TO_LIBRARY_MUTATION = gql`
  mutation SaveToLibrary(
    $story_id: ID!
    $library_id: ID!
  ) {
    saveToLibrary(
      story_id: $story_id
      library_id: $library_id
    ) {
      id
    }
  }
`

const LOGIN_WITH_FACEBOOK_MUTATION = gql`
  mutation LoginWithFacebookMutation(
    $facebook_accessToken: String!
  ){
    loginWithFacebook(
      facebook_accessToken: $facebook_accessToken
    ){
      token
    }
  }
`


export {
  LOGIN_WITH_FACEBOOK_MUTATION,
  UPDATE_CARD_MUTATION,
  LOGIN_WITH_GOOGLE_MUTATION,
  PAYMENT_MUTATION,
  GET_CUSTOMER_INFO,
  GET_INVOICES_QUERY,
  CANCEL_SUBSCRIPTION_MUTATION,
  RENEW_SUBSCRIPTION_MUTATION,
  getObjectConnectionQuery,
  LIBRARIES_QUERY,
  APPS_QUERY,
  UPDATE_ALGOLIA_INDEX_QUERY,
  DELETE_ALGOLIA_INDEX_QUERY,
  ADD_ALGOLIA_INDEX_QUERY,
  DELETE_LIBRARY_MUTATION,
  GET_LOGGED_IN_USER_QUERY,
  LIBRARIES_QUERY_SHALLOW,
  TOGGLE_STORY_LIBRARY_MUTATION,
  RESET_PASSWORD_MUTATION,
  VERIFY_FORGOT_PASSWORD_MUTATION,
  APP_QUERY,
  STORIES_QUERY,
  STORY_QUERY,
  JOBS_QUERY,
  SIGN_UP_MUTATION,
  LOGIN_MUTATION,
  LIBRARY_QUERY,
  FORGET_PASSWORD_MUTATION,
  EDIT_PROFILE_MUTATION,
  EDIT_LIBRARY_MUTATION,
  CREATE_LIBRARY_MUTATION,
  STORY_CATEGORIES_QUERY,
  STORY_ELEMENTS_QUERY,
  APP_VERSIONS_QUERY,
  APP_CATEGORIES_QUERY,
  SAVE_TO_LIBRARY_MUTATION,
  STORIES_QUERY_WITH_APP
}