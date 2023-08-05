import React, { useState, useEffect } from "react";
import { Select, Button, Box, HStack } from "@chakra-ui/react";
import axios from "axios";

interface Option {
  label: string;
  value: string;
}

interface Release {
  id: number;
  name: string;
  assets: Asset[];
}

interface Asset {
  name: string;
  browser_download_url: string;
}

function ReleaseDropdown() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [selectedRelease, setSelectedRelease] = useState<number | null>(null);
  const [selectedOS, setSelectedOS] = useState<string>("");
  const [selectedArch, setSelectedArch] = useState<string>("");
  const [osOptions, setOSOptions] = useState<Option[]>([]);
  const [archOptions, setArchOptions] = useState<Option[]>([]);

  useEffect(() => {
    // Fetch the list of releases
    const fetchReleases = async () => {
      try {
        const response = await axios.get<Release[]>(
          "https://api.github.com/repos/cirnum/loadtester/releases"
        );
        setReleases(response.data);
      } catch (error) {
        console.error("Error fetching releases:", error);
      }
    };

    fetchReleases();
  }, []);

  useEffect(() => {
    // Fetch OS names for the selected release
    const fetchOSOptions = async () => {
      try {
        const selectedReleaseData = releases.find(
          (release) => release.id === selectedRelease
        );
        if (!selectedReleaseData) return;

        const osSet = new Set<string>();
        selectedReleaseData.assets.forEach((asset) => {
          const name = asset.name.toLowerCase();
          const osMatch = name.match(
            /loadtester-release-v\d+\.\d+\.\d+-(\w+)-/
          );
          if (osMatch) {
            osSet.add(osMatch[1]);
          }
        });
        const options = Array.from(osSet).map((os) => ({
          label: os,
          value: os,
        }));
        setOSOptions(options);
      } catch (error) {
        console.error("Error fetching OS options:", error);
      }
    };

    if (selectedRelease) {
      fetchOSOptions();
    }
  }, [selectedRelease, releases]);

  useEffect(() => {
    // Fetch architecture options for the selected OS
    const fetchArchOptions = async () => {
      try {
        const selectedReleaseData = releases.find(
          (release) => release.id === selectedRelease
        );
        if (!selectedReleaseData) return;

        const archSet = new Set<string>();
        selectedReleaseData.assets.forEach((asset) => {
          const name = asset.name.toLowerCase();
          const archPattern =
            /loadtester-release-v\d+\.\d+\.\d+-\w+-(\w+)\.tar\.gz/;
          const archMatch = name.match(archPattern);
          if (name.includes(selectedOS) && archMatch) {
            archSet.add(archMatch[1]);
          }
        });
        const options = Array.from(archSet).map((arch) => ({
          label: arch,
          value: arch,
        }));
        setArchOptions(options);
      } catch (error) {
        console.error("Error fetching architecture options:", error);
      }
    };

    if (selectedOS) {
      fetchArchOptions();
    }
  }, [selectedRelease, selectedOS, releases]);

  const handleReleaseChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRelease(Number(event.target.value));
    setSelectedOS("");
    setSelectedArch("");
  };

  const handleOsChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOS(event.target.value);
    setSelectedArch("");
  };

  const handleArchChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedArch(event.target.value);
  };

  const handleDownloadClick = () => {
    if (selectedRelease && selectedOS && selectedArch) {
      const fileName = `${selectedOS}-${selectedArch}.tar.gz`;
      const selectedReleaseData = releases.find(
        (release) => release.id === selectedRelease
      );
      if (!selectedReleaseData) return;

      const downloadUrl = selectedReleaseData.assets.find((asset) =>
        asset.name.includes(fileName)
      )?.browser_download_url;
      if (downloadUrl) {
        // Create a temporary link element and simulate click to trigger download
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = fileName;
        link.click();
      } else {
        console.error("Download URL not found for selected options.");
      }
    }
  };

  return (
    <HStack spacing={4}>
      <Box>
        <Select
          placeholder="Select Release"
          value={selectedRelease?.toString() || ""}
          onChange={handleReleaseChange}
        >
          {releases.map((release) => (
            <option key={release.id} value={release.id.toString()}>
              {release.name}
            </option>
          ))}
        </Select>
      </Box>
      <Box>
        <Select
          placeholder="Select OS"
          value={selectedOS}
          onChange={handleOsChange}
          isDisabled={!selectedRelease}
        >
          {osOptions.map((os) => (
            <option key={os.value} value={os.value}>
              {os.label}
            </option>
          ))}
        </Select>
      </Box>
      <Box>
        <Select
          placeholder="Select Architecture"
          value={selectedArch}
          onChange={handleArchChange}
          isDisabled={!selectedOS}
        >
          {archOptions.map((arch) => (
            <option key={arch.value} value={arch.value}>
              {arch.label}
            </option>
          ))}
        </Select>
      </Box>
      <Button
        colorScheme="primary"
        onClick={handleDownloadClick}
        isDisabled={!selectedArch}
      >
        Download
      </Button>
    </HStack>
  );
}

export default ReleaseDropdown;
