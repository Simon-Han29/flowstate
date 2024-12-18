"use client";
import React, { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@radix-ui/react-popover";
import { Calendar } from "@/components/ui/calendar";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { JobType } from "@/types/authConntextTypes";

const My_applications = () => {
    const [jobs, setJobs] = useState<JobType[]>([]);
    const [isNewJobMenuShowing, setIsNewJobMenuShowing] =
        useState<boolean>(false);
    const [newCompany, setNewCompany] = useState<string>("");
    const [newJobTitle, setNewJobTitle] = useState<string>("");
    const [newStatus, setnewStatus] = useState<string>("Applied");
    const [newDate, setNewDate] = useState<Date | undefined>(new Date());
    const { id, isAuthenticated, loading, addJob } = useAuth();
    const router = useRouter();

    function handleNewCompanyChange(e: React.ChangeEvent<HTMLInputElement>) {
        setNewCompany(e.target.value);
    }

    function handleNewJobTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setNewJobTitle(e.target.value);
    }

    function handleSelectNewStatus(status: string) {
        setnewStatus(status);
    }

    function toggleJobMenu() {
        setIsNewJobMenuShowing((prev) => !prev);
    }

    function addNewJob() {
        const newJob: JobType = {
            company: newCompany,
            job_title: newJobTitle,
            status: newStatus,
            date_applied: newDate || new Date(),
        };

        setJobs((prev) => [...prev, newJob]);
        setNewCompany("");
        setNewJobTitle("");
        setnewStatus("Applied");
        setNewDate(new Date());
        addJob(newJob);
        setIsNewJobMenuShowing(false);
    }

    useEffect(() => {
        if (!isAuthenticated && !loading) {
            router.push("/login");
        } else if (!id) {
            return;
        } else {
            fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/user/${id}/job_applications`
            )
                .then((res) => {
                    console.log(res.status);
                    if (res.status === 200) {
                        console.log("We getting it here");
                        return res.json();
                    } else {
                        console.log("Something went wrong");
                    }
                })
                .then((storedList: JobType[]) => {
                    console.log("GETS TO STORED LIST");
                    console.log(storedList);
                    setJobs(storedList);
                });
        }
    }, [loading, isAuthenticated, router]);

    return (
        <div className="h-screen flex flex-col">
            <Navbar />

            <div className="flex-1 flex justify-center items-center">
                {isNewJobMenuShowing ? (
                    <Card className="absolute border w-[70%] h-[50rem] bg-white z-10">
                        <CardHeader className="flex flex-row justify-between items-center">
                            <CardTitle>New Job Information</CardTitle>
                            <Button onClick={toggleJobMenu}>Close</Button>
                        </CardHeader>
                        <CardContent className="flex flex-col">
                            <Input
                                placeholder="Company"
                                onChange={handleNewCompanyChange}
                            ></Input>
                            <Input
                                placeholder="Job title"
                                onChange={handleNewJobTitleChange}
                            ></Input>
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    {newStatus}
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>
                                        Status Options
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={() =>
                                            handleSelectNewStatus("Applied")
                                        }
                                    >
                                        Applied
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() =>
                                            handleSelectNewStatus(
                                                "Rejected/Ghosted"
                                            )
                                        }
                                    >
                                        Rejected/Ghosted
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() =>
                                            handleSelectNewStatus(
                                                "Interviewing"
                                            )
                                        }
                                    >
                                        Interviewing
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button>
                                        {newDate
                                            ? newDate.toLocaleDateString()
                                            : new Date().toLocaleTimeString()}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <Calendar
                                        mode="single"
                                        selected={newDate}
                                        onSelect={setNewDate}
                                    />
                                </PopoverContent>
                            </Popover>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={addNewJob}>Add</Button>
                        </CardFooter>
                    </Card>
                ) : (
                    <></>
                )}
                <Card
                    className={`w-[85%] ${
                        isNewJobMenuShowing
                            ? "no-select blur-lg pointer-events-none"
                            : ""
                    }`}
                >
                    <CardHeader className="flex flex-row justify-between items-center">
                        <CardTitle>Job Applications</CardTitle>
                        <Button onClick={toggleJobMenu}>Add +</Button>
                    </CardHeader>

                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Company</TableHead>
                                    <TableHead>Position</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date Applied</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {jobs &&
                                    jobs.map((job, index) => (
                                        <TableRow key={index + 1}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{job.company}</TableCell>
                                            <TableCell>
                                                {job.job_title}
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger>
                                                        Open
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                        <DropdownMenuLabel>
                                                            Status Options
                                                        </DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem>
                                                            Applied
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            Rejected/Ghosted
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            Interview Scheduled
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                            <TableCell>
                                                {new Date(
                                                    job.date_applied
                                                ).toLocaleDateString()}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default My_applications;
