import { Menu, Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

// MARK: DashboardHeader
export default function DashboardHeader() {
    const { setTheme } = useTheme();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();
    const modalRef = useRef(null);

    useEffect(() => {
        setTheme("light");
    }, [setTheme]);

    // Fetch search results based on search query
    useEffect(() => {
        const trimmedSearchQuery = searchQuery.trim();
        // if (trimmedSearchQuery.length > 0) {
        //   getInterviewsBySearchQuery(searchQuery).then((data) => {
        //     setSearchResults(data);
        //   }).catch((error) => { });
        // }
    }, [searchQuery]);

    const toggleMobileMenu = () => setIsMenuOpen(!isMenuOpen);

    function onSearch(searchQuery: string) {
        setSearchQuery(searchQuery);
    }



    return (
        <header className="w-screen border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <div className="mx-auto px-[32px] py-4 h-[85px] flex items-center justify-between">
                <Link href="/">
                    <Image
                        src={"/assets/icons/headerLogo.svg"}
                        width={120}
                        height={28}
                        alt="TalkTune logo"
                        className="w-auto h-auto cursor-pointer"
                        onClick={() => router.push("/dashboard")}
                    />
                </Link>
                {/* <div className="hidden sm:flex ">
                    <SearchBar searchQuery={searchQuery} setSearchQuery={onSearch} searchResults={searchResults} />
                </div> */}
                {/* Empty div for center alignment with maximum width of 40.889vw */}
                <div className="hidden sm:flex w-[20vw]"></div>
                <button
                    className="sm:hidden text-gray-600 dark:text-gray-300"
                    onClick={toggleMobileMenu}
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
        </header>
    );
}


// MARK: SearchBar
interface SearchResult {
    object_id: string;
    label: string;
    goal: string;
    skill: string;
    category: string;
    interview_text: string;
    time_limit: number;
    preferencesSchema: PreferenceSchema[];
    introduction: string[];
    prompt_template_id: string;
    evaluate_template_id: string;
    stages: Stage[];
    is_interim_enable: boolean;
}

interface PreferenceSchema {
    name: string;
    type: string;
    options: string[];
    defaultValue: string[];
    label: string;
    placeholder: string | null;
    addNewOption: boolean | null;
    removeOption: boolean | null;
    validation: Validation;
}

interface Validation {
    required: boolean;
    min: number | null;
    max: number | null;
}

interface Stage {
    stage: string;
    quizeCount: number;
    stageInOrder: boolean;
}

interface SearchBarProps {
    searchQuery: string;
    setSearchQuery: (value: string) => void;
    searchResults: SearchResult[];
}

// function SearchBar({ searchQuery, setSearchQuery, searchResults }: Readonly<SearchBarProps>) {
//     const [results, setResults] = useState(searchResults);
//     const [isDropdownVisible, setIsDropdownVisible] = useState(false);
//     const searchContainerRef = useRef<HTMLDivElement>(null);
//     const router = useRouter();

//     // Handle clicks outside the search bar to close dropdown
//     useEffect(() => {
//         const handleClickOutside = (event: MouseEvent) => {
//             if (
//                 searchContainerRef.current &&
//                 !searchContainerRef.current.contains(event.target as Node)
//             ) {
//                 setIsDropdownVisible(false);
//             }
//         };

//         document.addEventListener('mousedown', handleClickOutside);
//         return () => {
//             document.removeEventListener('mousedown', handleClickOutside);
//         };
//     }, []);

//     // Memoize search change handler to prevent unnecessary re-renders
//     const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
//         const value = e.target.value;
//         setSearchQuery(value);
//         setIsDropdownVisible(value.length > 0);

//         const searchWords = value.toLowerCase().split(' ');
//         const filteredResults = searchResults.filter((result: SearchResult) =>
//             searchWords.every(word =>
//                 result.label.toLowerCase().includes(word) ||
//                 result.interview_text.toLowerCase().includes(word)
//             )
//         );

//         setResults(filteredResults);
//     }, [searchResults, setSearchQuery]);

//     // Memoize result selection handler
//     const handleResultSelect = useCallback((result: SearchResult) => {
//         router.push(`/meet/`);
//     }, [router]);

//     return (
//         <div
//             ref={searchContainerRef}
//             className="relative lg:w-[40.889vw] sm:w-[30vw] w-[80vw]"
//         >
//             <Search className="absolute left-3 top-2 text-gray-400" />
//             <input
//                 type="text"
//                 placeholder="Search here"
//                 value={searchQuery}
//                 onChange={handleSearchChange}
//                 onFocus={() => setIsDropdownVisible(searchQuery.length > 0)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray2 dark:border-gray3 rounded-lg bg-white dark:bg-gray5 text-gray6 dark:text-gray1 placeholder4 dark:placeholder-gray3 focus:ring-2 focus:ring-primary focus:border-transparent"
//             />
//             {isDropdownVisible && (
//                 <div className="absolute top-full left-0 w-full mt-1 z-50">
//                     <SearchResultsDropdown
//                         searchQuery={searchQuery}
//                         results={results}
//                         onSelectResult={handleResultSelect}
//                     />
//                 </div>
//             )}
//         </div>
//     );
// }

// // MARK: SearchResultsDropdown
// interface SearchResultsDropdownProps {
//     searchQuery: string;
//     results: SearchResult[];
//     onSelectResult: (result: SearchResult) => void;
// }

// function SearchResultsDropdown({
//     searchQuery,
//     results,
//     onSelectResult
// }: Readonly<SearchResultsDropdownProps>) {

//     // Filter results based on search query
//     // In SearchResultsDropdown component
//     const filteredResults = results.filter(result => {
//         const searchWords = searchQuery.toLowerCase().split(' ');
//         return searchWords.every(word =>
//             result.label.toLowerCase().includes(word) ||
//             result.interview_text.toLowerCase().includes(word)
//         );
//     });

//     // Handle result selection
//     const handleResultSelect = (result: SearchResult) => {
//         onSelectResult(result);
//     };

//     if (!searchQuery || filteredResults.length === 0) {
//         return null;
//     }

//     return (
//         <div
//             className="absolute z-50 top-full left-0 mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-[300px] overflow-y-auto"
//         >
//             {filteredResults.map((result, index) => (
//                 <div
//                     key={result.object_id}
//                     onClick={() => handleResultSelect(result)}
//                     className={`block px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer`}
//                 >
//                     <div className="flex items-center">
//                         <Search className="mr-3 text-gray-400" size={16} />
//                         <div>
//                             <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
//                                 {result.interview_text}
//                             </h3>
//                             <p className="text-xs text-gray-500 dark:text-gray-400">
//                                 {result.category}
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//             ))}
//         </div>
//     );
// };