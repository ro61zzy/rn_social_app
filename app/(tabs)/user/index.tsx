import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useGetUserProfileQuery } from "@/server/api";
import { UserCommunity } from "@/types/types";



const fallbackAvatar =
  "https://ui-avatars.com/api/?name=User&background=random";

export default function UserPage() {
  const [userHandle, setUserHandle] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem("userHandle").then(setUserHandle);
  }, []);

  const { data, isLoading, error } = useGetUserProfileQuery(userHandle!, {
    skip: !userHandle,
  });

  if (isLoading || !userHandle) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4b006e" />
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Failed to load profile</Text>
      </View>
    );
  }

  const {
    user_handle,
    display_name,
    avatar,
    bio,
    aura,
    created_at,
    communities,
  } = data;

  const joinDate = new Date(created_at).toLocaleDateString();

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.container}>
        <View style={styles.profileBox}>
          <Image
            source={{ uri: avatar || fallbackAvatar }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{display_name || "Unnamed User"}</Text>
          <Text style={styles.handle}>@{user_handle}</Text>
          <Text style={styles.bio}>{bio || "No bio available."}</Text>
          <Text style={styles.aura}>✨ Aura: {aura}</Text>
          <Text style={styles.joined}>Joined: {joinDate}</Text>
        </View>

        {communities?.length > 0 && (
          <View style={styles.communitiesBox}>
            <Text style={styles.sectionTitle}>Communities</Text>
           {communities.map((c: UserCommunity, idx: number) => (
              <View key={idx} style={styles.communityItem}>
                <Image
                  source={{
                    uri:
                      c.community_details.logo?.preview_url ||
                      fallbackAvatar,
                  }}
                  style={styles.communityLogo}
                />
                <View style={styles.communityText}>
                  <Text style={styles.communityName}>
                    {c.community_details.name}
                  </Text>
                  <Text style={styles.communityAura}>
                    Aura: {c.aura || 0}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingVertical: 30 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: {
    paddingHorizontal: 20,
    alignItems: "center",
  },
  profileBox: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fdfdfd",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    width: "100%",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
  },
  handle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4b006e",
  },
  bio: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
    textAlign: "center",
  },
  aura: {
    marginTop: 6,
    fontSize: 14,
    color: "#444",
  },
  joined: {
    marginTop: 2,
    fontSize: 12,
    color: "#aaa",
  },
  error: {
    color: "red",
    fontSize: 16,
  },
  communitiesBox: {
    marginTop: 30,
    width: "100%",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  communityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  communityLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ddd",
    marginRight: 12,
  },
  communityText: {
    flex: 1,
  },
  communityName: {
    fontSize: 16,
    fontWeight: "500",
  },
  communityAura: {
    fontSize: 13,
    color: "#666",
  },
});
